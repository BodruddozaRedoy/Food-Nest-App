import seed from '@/lib/seed'
import React from 'react'
import { Button, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const SearchScreen = () => {
  return (
    <SafeAreaView>
        <Text>SearchScreen</Text>
      <Button title='Seed' onPress={() => seed().catch((err) => console.log("failed to seed the database", err))} />
    </SafeAreaView>
  )
}

export default SearchScreen