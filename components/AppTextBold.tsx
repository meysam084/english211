import React from 'react'
import { Text, TextProps } from 'react-native'

export default function AppTextBold(props: TextProps) {
  return (
    <Text
      {...props}
      style={[{ fontFamily: 'VazirBold' }, props.style]}
    >
      {props.children}
    </Text>
  )
}
