jest.mock('nativewind', () => ({
  styled: (Component) => Component,
}));

jest.mock('@/components/ui/card', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    Card: ({ children, ...props }) => <View {...props}>{children}</View>,
    CardHeader: ({ children, ...props }) => <View {...props}>{children}</View>,
    CardTitle: ({ children, ...props }) => <View {...props}>{children}</View>,
    CardDescription: ({ children, ...props }) => <View {...props}>{children}</View>,
    CardContent: ({ children, ...props }) => <View {...props}>{children}</View>,
    CardFooter: ({ children, ...props }) => <View {...props}>{children}</View>,
  };
});

jest.mock('@/components/ui/button', () => {
  const React = require('react');
  const { Pressable, Text } = require('react-native');
  return {
    Button: ({ children, ...props }) => (
      <Pressable {...props}>
        <Text>{children}</Text>
      </Pressable>
    ),
  };
});

jest.mock('@rn-primitives/label', () => {
  const React = require('react');
  return {
    __esModule: true,
    Root: React.forwardRef((props, ref) =>
      React.createElement('View', { ...props, ref }, props.children)
    ),
    Text: React.forwardRef((props, ref) =>
      React.createElement('Text', { ...props, ref }, props.children)
    ),
  };
});

jest.mock('@/components/ui/label', () => {
  const React = require('react');
  return {
    __esModule: true,
    Label: (props) => React.createElement('Text', props, props.children),
  };
});

jest.mock('@/components/ui/text', () => {
  const React = require('react');
  return {
    __esModule: true,
    Text: (props) => React.createElement('Text', props, props.children),
  };
});

jest.mock('@/components/ui/input', () => {
  const React = require('react');
  return {
    __esModule: true,
    Input: React.forwardRef((props, ref) => React.createElement('TextInput', { ...props, ref })),
  };
});

jest.mock('@react-native-community/datetimepicker', () => {
  const React = require('react');
  const MockDateTimePicker = React.forwardRef((props, ref) =>
    React.createElement(
      'View',
      {
        ...props,
        ref,
        testID: props.testID || 'date-time-picker',
        onPress: () => {
          props.onChange?.({ type: 'set' }, new Date('2023-01-15T12:00:00Z'));
        },
      },
      props.children
    )
  );
  MockDateTimePicker.displayName = 'DateTimePicker';
  return MockDateTimePicker;
});

jest.mock('@/lib/utils', () => ({
  cn: (...classes) => classes.filter(Boolean).join(' '),
}));

jest.mock('expo-router', () => ({
  router: {
    replace: jest.fn(),
    back: jest.fn(),
    push: jest.fn(),
    navigate: jest.fn(),
  },
  Stack: {
    Screen: ({ children, ...props }) => null,
  },
  useRouter: () => ({
    replace: jest.fn(),
    back: jest.fn(),
    push: jest.fn(),
    navigate: jest.fn(),
  }),
  useSegments: () => [],
  usePathname: () => '',
  useLocalSearchParams: () => ({}),
  useGlobalSearchParams: () => ({}),
}));