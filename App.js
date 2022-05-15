import { useRef } from 'react';
import { StatusBar } from "expo-status-bar"
import { Animated, StyleSheet, Text, View, FlatList, Platform, Dimensions, Image } from 'react-native';

import Products from './src/services/api';

const { width, height } = Dimensions.get('window');
const ITEM_SIZE = width * 0.74;
const SPACER = (width - ITEM_SIZE) / 2;

export default function App() {
  const products = [
    {
      key: 'left'
    },
    ...Products,
    {
      key: 'right'
    }
  ]

  const scrollX = useRef(new Animated.Value(0)).current;

  return (
    <>
    <StatusBar hidden />
    <View style={styles.container}>
      {products.map((el, index) => {
        const inputRange = [(index - 2) * ITEM_SIZE, (index - 1) * ITEM_SIZE, index * ITEM_SIZE]
        return(
          <Animated.View key={`Index: ${index}`} style={[
            StyleSheet.absoluteFillObject,
            {
              opacity: scrollX.interpolate({
                inputRange,
                outputRange: [0, 1, 0]
              }),
              justifyContent: 'center',
              backgroundColor: el.color
            }
          ]}>
            <Image
              style={{
                width: 330,
                height: 220,
                resizeMode: 'cover'
              }}
              blurRadius={30}
              source={{ uri: el.source }}
            />
          </Animated.View>
        )
      })}
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Animated.FlatList
          data={products}
          keyExtractor={((el, index) => index)}
          renderItem={(({ item, index }) => {
            const inputRange = [(index - 2) * ITEM_SIZE, (index - 1) * ITEM_SIZE, index * ITEM_SIZE]

            if(!item.source) {
              return <View style={{ width: SPACER }} />
            }
            
            return(
              <View style={{ width: ITEM_SIZE, justifyContent: 'center' }}>
                <Animated.View style={[styles.poster, { 
                  backgroundColor: item.color,
                  transform: [
                    {
                      translateY: scrollX.interpolate({
                        inputRange,
                        outputRange: [0, -50, 0]
                      })
                    }
                  ]
                }]}>
                  <Image 
                    source={{ uri: item.source }}
                    style={styles.image}
                  />
                  <View style={styles.info}>
                    <Text style={styles.title}>{item.name}</Text>
                    <Text style={styles.description} numberOfLines={2}>
                      {item.description}
                    </Text>
                    <Text style={styles.price}>
                      R$ {item.price},00
                    </Text>
                  </View>
                </Animated.View>
              </View>
            )
          })}
          horizontal
          showsHorizontalScrollIndicator={false}
          bounces={false}
          pagingEnabled
          snapToInterval={ITEM_SIZE}
          decelerationRate={0}
          scrollEventThrottle={16}
          contentContainerStyle={{
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onScroll={Animated.event([{ nativeEvent: {contentOffset: { x: scrollX}}}], {
            useNativeDriver: false
          })}
        />
      </View>
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  poster: {
    width: 180,
    height: '80%',
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    marginHorizontal: 30,
    shadowOpacity: 0.25,
    shadowOffset: {
      width: 122,
      height: 222
    },
    shadowColor: '#333'
  },
  image: {
    width: 260,
    height: 160,
    resizeMode: 'cover',
    transform: [
      {
        rotate: '-12deg'
      }
    ],
    marginRight: 20
  },
  info: {
    width: '100%',
    margin: 12,
    padding: 12
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: "#f9f9f9"
  },
  description: {
    fontSize: 12,
    fontWeight: '300',
    color: "#f9f9f9",
    paddingVertical: 8
  },
  price: {
    fontSize: 24,
    fontWeight: '300',
    color: "#f9f9f9"
  }
});
