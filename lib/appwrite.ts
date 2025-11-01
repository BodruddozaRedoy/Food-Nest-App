import { CreateUserParams, GetMenuParams, SignInParams } from "@/type";
import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Storage,
} from "react-native-appwrite";

export const appwriteConfig = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
  platform: "com.devredoy.foodnest",
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
  databaseId: "69020d1800091329de68",
  userCollection: "user",
  categoryCollection: "categories",
  menuCollection: "menu",
  customizationsCollection: "customizations",
  menuCustomizationsCollection: "menu_customizations",
  bucketId: "69023f06002c43e95b9f",
};

export const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint!)
  .setProject(appwriteConfig.projectId!)
  .setPlatform(appwriteConfig.platform);

export const account = new Account(client);
export const databases = new Databases(client);
const avatars = new Avatars(client);
export const storage = new Storage(client);

export const createUser = async ({
  email,
  password,
  name,
}: CreateUserParams) => {
  try {
    const newAccount = await account.create(ID.unique(), email, password, name);
    if (!newAccount) throw new Error("Account creation failed");

    // Sign in the user
    await signIn({ email, password });

    // Generate avatar URL
    const avatarUrl = avatars.getInitialsURL(name);

    // Create a user document in the DB
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollection,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        name,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (error: any) {
    throw new Error(error.message || "Error creating user");
  }
};

export const signIn = async ({ email, password }: SignInParams) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
  } catch (error) {
    throw new Error(error as string);
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) return null;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollection,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser || currentUser.total === 0) return null;

    return currentUser.documents[0];
  } catch (error: any) {
    // ✅ Gracefully handle "guest" state
    if (error?.message?.includes("missing scopes") || error?.code === 401) {
      return null;
    }

    console.error("Appwrite getCurrentUser error:", error);
    throw error;
  }
};

export const getMenu = async ({ category, query }: GetMenuParams) => {
  try {
    const queries = [];
    if (category) queries.push(Query.equal("categories", category));
    if (query) queries.push(Query.search("name", query));
    const menus = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.menuCollection,
      queries
    );
    return menus.documents;
  } catch (error) {
    throw new Error(error as string);
  }
};

export const getCategories = async () => {
  try {
    const categories = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.categoryCollection
    );
    return categories.documents;
  } catch (error) {
    throw new Error(error as string);
  }
};
