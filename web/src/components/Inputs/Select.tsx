import { InfiniteList } from '@/components/InfiniteList';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { Modal } from '../Modal';
import { InputText } from './InputText';

export interface SelectOption<T = any> {
  label: string;
  value: string;
  data?: T;
}

interface SelectProps<T = any> {
  label?: string;
  placeholder?: string;
  value?: string;
  onValueChange?: (value: string, option: SelectOption<T>) => void;
  error?: string;
  isRequired?: boolean;
  disabled?: boolean;
  options: SelectOption<T>[];
  modalSearchPlaceholder?: string;
  emptyMessage?: string;
  editable?: boolean; 
  labelModalSearch?: string;
  isLoading?: boolean;
  isFetchingNextPage?: boolean;
  hasNextPage?: boolean;
  onLoadMore?: () => void;
  onSearchChange?: (search: string) => void;
  renderItem?: (
    item: SelectOption<T>,
    isSelected: boolean,
    onSelect: () => void
  ) => React.ReactElement;
  itemClassName?: string;
}

export function Select<T = any>({
  label,
  labelModalSearch = 'Pesquisar',
  placeholder = 'Selecione...',
  value,
  onValueChange,
  error,
  isRequired = false,
  disabled = false,
  options,
  modalSearchPlaceholder = 'Pesquisar...',
  emptyMessage = 'Nenhum item encontrado',
  isLoading = false,
  isFetchingNextPage = false,
  hasNextPage = false,
  editable = true,
  onLoadMore,
  onSearchChange,
  renderItem,
  itemClassName = '',
}: SelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState('');

  const selectedOption = options.find((opt) => opt.value === value);

  const handleSearch = (text: string) => {
    setSearchText(text);
    onSearchChange?.(text);
  };

  const handleSelect = (option: SelectOption<T>) => {
    onValueChange?.(option.value, option);
    setIsOpen(false);
    setSearchText('');
  };

  const filteredOptions = onSearchChange
    ? options
    : options.filter((opt) => opt.label.toLowerCase().includes(searchText.toLowerCase()));

  const defaultRenderItem = (item: SelectOption<T>, isSelected: boolean, onSelect: () => void) => (
    <Pressable onPress={onSelect} className={`${itemClassName} ${isSelected ? 'bg-accent' : ''}`}>
      <Text className={isSelected ? 'font-semibold' : ''}>{item.label}</Text>
    </Pressable>
  );

  return (
    <View className="mb-3">
      {label && (
        <Label className="mb-1">
          {label} {isRequired && <Text className="text-red-500">*</Text>}
        </Label>
      )}

      <Pressable
        onPress={() => !disabled && setIsOpen(true)}
        disabled={disabled}
        className={`flex h-10 flex-row items-center justify-between rounded-md border px-3 py-2 ${
          error ? 'border-red-500' : 'border-input'
        } ${disabled ? 'opacity-50' : ''}`}>
        <Text className={selectedOption ? '' : 'text-muted-foreground'}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
      </Pressable>

      {error && <Text className="mt-1 text-xs text-red-500">{error}</Text>}

      <Modal
        isOpen={isOpen && editable}
        height={600}
        width={370}
        Header={
          <View className="mb-3 w-full">
            <InputText
              label={labelModalSearch}
              value={searchText}
              editable={editable}
              onChangeText={handleSearch}
              placeholder={modalSearchPlaceholder}
            />
          </View>
        }
        description={
          <View className="h-[420px] w-full">
            <InfiniteList
              data={filteredOptions}
              renderItem={(item) => {
                const isSelected = item.value === value;
                const onSelect = () => handleSelect(item);

                return renderItem
                  ? renderItem(item, isSelected, onSelect)
                  : defaultRenderItem(item, isSelected, onSelect);
              }}
              isLoading={isLoading}
              isFetchingNextPage={isFetchingNextPage}
              hasNextPage={hasNextPage}
              onLoadMore={onLoadMore}
              emptyMessage={emptyMessage}
              className="flex-1"
              keyExtractor={(item) => item.value}
            />
          </View>
        }
        footerButtons={
          <View className="flex w-full flex-row items-end justify-end">
            <Button onPress={() => setIsOpen(false)}>
              <Text>Cancelar</Text>
            </Button>
          </View>
        }
      />
    </View>
  );
}
