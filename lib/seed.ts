import { ID } from "react-native-appwrite";
import { appwriteConfig, databases, storage } from "./appwrite";
import dummyData from "./data";
import * as FileSystem from "expo-file-system";

interface Category {
  name: string;
  description: string;
}

interface Customization {
  name: string;
  price: number;
  type: "topping" | "side" | "size" | "crust" | string;
}

interface MenuItem {
  name: string;
  description: string;
  image_url: string;
  price: number;
  rating: number;
  calories: number;
  protein: number;
  category_name: string;
  customizations: string[];
}

interface DummyData {
  categories: Category[];
  customizations: Customization[];
  menu: MenuItem[];
}

const data = dummyData as DummyData;

/* ------------------ Helpers ------------------ */

async function clearAll(collectionId: string): Promise<void> {
  const list = await databases.listDocuments(
    appwriteConfig.databaseId,
    collectionId
  );

  await Promise.all(
    list.documents.map((doc) =>
      databases.deleteDocument(appwriteConfig.databaseId, collectionId, doc.$id)
    )
  );
}

async function clearStorage(): Promise<void> {
  const list = await storage.listFiles(appwriteConfig.bucketId);

  await Promise.all(
    list.files.map((file: any) =>
      storage.deleteFile(appwriteConfig.bucketId, file.$id)
    )
  );
}

async function uploadImageToStorage(imageUrl: string) {
  try {
    // use new File API (no deprecated createDownloadResumable)
    const fileName = imageUrl.split("/").pop() || `file-${Date.now()}.jpg`;
    const localPath = `${FileSystem.documentDirectory}${fileName}`;

    // download file directly
    const response = await FileSystem.downloadAsync(imageUrl, localPath);

    // get size info
    const fileInfo = await FileSystem.getInfoAsync(response.uri, {
      size: true,
    });

    const file = await storage.createFile(
      appwriteConfig.bucketId,
      ID.unique(),
      {
        uri: response.uri,
        name: fileName,
        type: "image/jpeg",
        size: fileInfo.size ?? 0,
      }
    );

    return storage.getFileView(appwriteConfig.bucketId, file.$id);
  } catch (err) {
    console.error("❌ Image upload failed:", imageUrl, err);
    return imageUrl; // fallback so seeding continues
  }
}

/* ------------------ Main Seeder ------------------ */

async function seed(): Promise<void> {
  console.log("🧹 Clearing existing data...");
  await clearAll(appwriteConfig.categoryCollection);
  await clearAll(appwriteConfig.customizationsCollection);
  await clearAll(appwriteConfig.menuCollection);
  await clearAll(appwriteConfig.menuCustomizationsCollection);
  await clearStorage();

  console.log("📦 Seeding categories...");
  const categoryMap: Record<string, string> = {};
  for (const cat of data.categories) {
    const doc = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.categoryCollection,
      ID.unique(),
      cat
    );
    categoryMap[cat.name] = doc.$id;
  }

  console.log("📦 Seeding customizations...");
  const customizationMap: Record<string, string> = {};
  for (const cus of data.customizations) {
    const doc = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.customizationsCollection,
      ID.unique(),
      {
        name: cus.name,
        price: cus.price,
        type: cus.type,
      }
    );
    customizationMap[cus.name] = doc.$id;
  }

  console.log("🍔 Seeding menu items...");
  const menuMap: Record<string, string> = {};

  for (const item of data.menu) {
    try {
      const uploadedImage = await uploadImageToStorage(item.image_url);

      const doc = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.menuCollection,
        ID.unique(),
        {
          name: item.name,
          description: item.description,
          image_url: uploadedImage,
          price: item.price,
          rating: item.rating,
          calories: item.calories,
          protein: item.protein,
          categories: categoryMap[item.category_name],
        }
      );

      menuMap[item.name] = doc.$id;

      for (const cusName of item.customizations) {
        await databases.createDocument(
          appwriteConfig.databaseId,
          appwriteConfig.menuCustomizationsCollection,
          ID.unique(),
          {
            menu: doc.$id,
            customizations: customizationMap[cusName],
          }
        );
      }

      console.log("✅ Added menu:", item.name);
    } catch (err) {
      console.error("❌ Failed to create menu item:", item.name, err);
    }
  }

  console.log("✅ Seeding complete.");
}

export default seed;
