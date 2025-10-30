import CustomHeader from '@/components/CustomHeader';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  return (
    <ScrollView className="flex-1 bg-white p-4">
      <SafeAreaView>
        <CustomHeader title='Profile' />
        {/* Profile Image */}
        <View className="items-center mt-4">
          <View className="relative">
            <Image
              source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
              className="w-24 h-24 rounded-full"
            />
            <View className="absolute bottom-0 right-0 bg-orange-500 p-2 rounded-full">
              <Ionicons name="pencil" size={14} color="white" />
            </View>
          </View>
        </View>

        {/* Profile Info Card */}
        <View className="bg-white rounded-2xl shadow mt-6 p-4 gap-5">
          {/* Full Name */}
          <View className="flex-row items-center mb-4">
            <Ionicons name="person-outline" size={20} color="orange" />
            <View className="ml-3">
              <Text className="text-gray-500 text-sm">Full Name</Text>
              <Text className="text-lg font-semibold">Adrian Hajdin</Text>
            </View>
          </View>

          {/* Email */}
          <View className="flex-row items-center mb-4">
            <Ionicons name="mail-outline" size={20} color="orange" />
            <View className="ml-3">
              <Text className="text-gray-500 text-sm">Email</Text>
              <Text className="text-lg font-semibold">adrian@jsmastery.com</Text>
            </View>
          </View>

          {/* Phone */}
          <View className="flex-row items-center mb-4">
            <Ionicons name="call-outline" size={20} color="orange" />
            <View className="ml-3">
              <Text className="text-gray-500 text-sm">Phone Number</Text>
              <Text className="text-lg font-semibold">+1 555 123 4567</Text>
            </View>
          </View>

          {/* Address 1 */}
          <View className="flex-row items-center mb-4">
            <Ionicons name="location-outline" size={20} color="orange" />
            <View className="ml-3">
              <Text className="text-gray-500 text-sm">Address 1 - (Home)</Text>
              <Text className="text-lg font-semibold">123 Main Street, Springfield, IL 62704</Text>
            </View>
          </View>

          {/* Address 2 */}
          <View className="flex-row items-center mb-2">
            <Ionicons name="location-outline" size={20} color="orange" />
            <View className="ml-3">
              <Text className="text-gray-500 text-sm">Address 2 - (Work)</Text>
              <Text className="text-lg font-semibold">221B Rose Street, Foodville, FL 12345</Text>
            </View>
          </View>
        </View>

        {/* Buttons */}
        <View className="mt-6 gap-5">
          <TouchableOpacity className="border border-orange-400 py-3 rounded-full items-center">
            <Text className="text-orange-500 font-semibold">Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity className="border border-red-400 bg-red-100 py-3 rounded-full items-center">
            <Text className="text-red-500 font-semibold">Logout</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}
