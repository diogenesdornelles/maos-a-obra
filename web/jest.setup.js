jest.mock('nativewind', () => ({
  styled: (Component) => Component,
}));

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
