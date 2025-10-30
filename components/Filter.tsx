import { Category } from '@/type'
import cn from 'clsx'
import { router } from 'expo-router'
import { useSearchParams } from 'expo-router/build/hooks'
import React, { useState } from 'react'
import { FlatList, Platform, Text, TouchableOpacity } from 'react-native'

const Filter = ({ categories }: { categories: Category[] }) => {
    const searchParams = useSearchParams()
    const [active, setActive] = useState(searchParams.category || "")

    const handlePress = (id: string) => {
        setActive(id)
        if(id == "all") router.setParams({category:undefined})
        else router.setParams({category:id})
    }
    const filterData = categories ? [{ $id: "all", name: "All" }, ...categories] : [{ $id: "all", name: "All" }]
    return (
        <FlatList
            data={filterData}
            keyExtractor={(item) => item.$id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName='gap-x-2 pb-3'
            renderItem={({ item }) => (
                <TouchableOpacity className={cn("filter", active === item.$id ? "bg-amber-500" : "bg-white-100")} style={Platform.OS === "android" ? { elevation: 5, shadowColor: "#878787" } : {}} onPress={() => handlePress(item.$id)}>
                    <Text className={cn("body-medium", active === item.$id ? "text-white-100" : "text-gray-200")}>{item.name}</Text>
                </TouchableOpacity>
            )}

        />
    )
}

export default Filter