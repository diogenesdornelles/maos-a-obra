import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react-native';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Text } from '../ui/text';

export interface CardMenuProps {
  icon?: LucideIcon;
  label?: string;
  onPress?: () => void;
}

export function CardMenu({ label, icon: Icon, onPress }: CardMenuProps) {
  return (
    <TouchableOpacity onPress={onPress} className="z-50 w-40" activeOpacity={0.7}>
      <Card className="w-40">
        <CardContent>
          <View className="w-full items-center justify-center">
            {Icon ? <Icon size={50} strokeWidth={1.25} color={'#111827'} /> : null}
          </View>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Text className="font-bold">{label}</Text>
        </CardFooter>
      </Card>
    </TouchableOpacity>
  );
}
