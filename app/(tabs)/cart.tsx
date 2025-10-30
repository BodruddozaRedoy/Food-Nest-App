import CartItem from '@/components/CartItem'
import CustomButton from '@/components/CustomButton'
import CustomHeader from '@/components/CustomHeader'
import { useCartStore } from '@/store/cart.store'
import { PaymentInfoStripeProps } from '@/type'
import cn from 'clsx'
import { router } from 'expo-router'
import React from 'react'
import { FlatList, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const PaymentInfoStripe = ({ label, value, labelStyle, valueStyle, }: PaymentInfoStripeProps) => (
  <View className="flex-between flex-row my-1">
    <Text className={cn("paragraph-medium text-gray-200", labelStyle)}>
      {label}
    </Text>
    <Text className={cn("paragraph-bold text-dark-100", valueStyle)}>
      {value}
    </Text>
  </View>
);

export default function CartScreen() {
  const { items, getTotalItems, getTotalPrice } = useCartStore()
  const totalItems = getTotalItems()
  const totalPrice = getTotalPrice()
  return (
    <SafeAreaView className=' h-full'>
      <FlatList
        data={items}
        renderItem={({ item }) => <CartItem item={item} />}
        keyExtractor={(item) => item.id}
        contentContainerClassName='pb-28 px-5 pt-5'
        ListHeaderComponent={() => <CustomHeader title='Your Cart' />}
        ListEmptyComponent={() => <View className='h-full justify-center items-center'><Text className='text-center mb-3'>Cart Empty! </Text><CustomButton title='Add Some Food' onPress={() => router.push("/search")} /></View>}
        ListFooterComponent={() => totalItems > 0 && (
          <View className='mt-6 bg-white-100 shadow p-5 rounded-2xl'>
            <Text className='h3-bold text-dark-100 mb-5'>
              Payment Summary
            </Text>
            <View className='gap-5'>
              <PaymentInfoStripe label={`Total Items (${totalItems})`} value={`$${totalPrice?.toFixed(2)}`} />
              <PaymentInfoStripe label={`Delivery Fee`} value={`$5.00`} />
              <PaymentInfoStripe label={`Discount`} value={`$0.50`} valueStyle='!text-success' />
              <View className='border-t border-gray-300 my-2' />
              <PaymentInfoStripe label={`Total`} value={`$${(totalPrice + 5 - 0.5)?.toFixed(2)}`} labelStyle='base-bold !text-dark-100' valueStyle='base-bold !text-dark-100 !text-right' />
            </View>
            <CustomButton title='Order Now' />
          </View>
        )}
      />
    </SafeAreaView>
  )
}