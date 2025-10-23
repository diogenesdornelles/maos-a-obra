import { Text } from '@/components/ui/text';
import { FlashList } from '@shopify/flash-list';
import { ActivityIndicator, View } from 'react-native';
import { Separator } from '../ui/separator';

interface InfiniteListProps<T> {
  data: T[];
  renderItem: (item: T, index: number) => React.ReactElement;
  isLoading?: boolean;
  isFetchingNextPage?: boolean;
  hasNextPage?: boolean;
  onLoadMore?: () => void;
  emptyMessage?: string;
  loadingSize?: 'small' | 'large';
  onEndReachedThreshold?: number;
  className?: string;
  keyExtractor?: (item: T, index: number) => string;
  ItemSeparatorComponent?: React.ComponentType;
}

export function InfiniteList<T>({
  data,
  renderItem,
  isLoading = false,
  isFetchingNextPage = false,
  hasNextPage = false,
  onLoadMore,
  emptyMessage = 'Nenhum item encontrado',
  loadingSize = 'large',
  onEndReachedThreshold = 0.5,
  className = '',
  keyExtractor,
  ItemSeparatorComponent = Separator,
}: InfiniteListProps<T>) {
  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage && onLoadMore) {
      onLoadMore();
    }
  };

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;

    return (
      <View className="py-4">
        <ActivityIndicator size="small" />
      </View>
    );
  };

  const renderEmpty = () => (
    <View className="items-center justify-center p-10">
      <Text className="text-gray-500">{emptyMessage}</Text>
    </View>
  );

  if (isLoading) {
    return (
      <View className={`${className} flex-1 items-center justify-center`}>
        <ActivityIndicator size={loadingSize} />
      </View>
    );
  }

  return (
    <FlashList
      data={data}
      renderItem={({ item, index }) => renderItem(item, index)}
      keyExtractor={
        keyExtractor
          ? (item, index) => keyExtractor(item, index)
          : (item, index) => index.toString()
      }
      ItemSeparatorComponent={ItemSeparatorComponent}
      ListEmptyComponent={renderEmpty}
      ListFooterComponent={renderFooter}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={onEndReachedThreshold}
      contentContainerStyle={{ paddingHorizontal: 20 }}
    />
  );
}