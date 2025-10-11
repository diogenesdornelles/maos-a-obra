import { View } from 'react-native';
import { CardMenu, CardMenuProps } from './CardMenu';

export interface ListMenuProps {
  dataMenu: CardMenuProps[];
  className?: string;
}

export function ListMenu({
  dataMenu,
  className = 'flex-row flex-wrap justify-center gap-6 px-6 py-5',
}: ListMenuProps) {
  return (
    <View className={className}>
      {dataMenu?.map((card) => (
        <CardMenu key={card.label} {...card} />
      ))}
    </View>
  );
}
