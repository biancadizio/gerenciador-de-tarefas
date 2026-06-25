/* eslint-disable react/display-name */
import React from 'react';
import renderer from 'react-test-renderer';

import TaskDetailsModal from '../TaskDetailsModal';
import { Task } from '../../types/types';

function createMockComponent(name: string) {
  return (props: any) => React.createElement('View', props, props.children);
}

jest.mock('react-native', () => {
  const PickerMock: any = createMockComponent('Picker');
  PickerMock.Item = createMockComponent('PickerItem');

  return {
    View: createMockComponent('View'),
    Text: createMockComponent('Text'),
    TextInput: createMockComponent('TextInput'),
    TouchableOpacity: createMockComponent('TouchableOpacity'),
    StyleSheet: { create: () => ({}) },
    Modal: createMockComponent('Modal'),
    Platform: { OS: 'ios' },
    Dimensions: {
      get: () => ({ width: 390, height: 844 }),
    },
  };
});

jest.mock('@react-native-picker/picker', () => {
  const createMockComponent = (name: string) => (props: any) => React.createElement('View', props, props.children);
  const PickerMock: any = createMockComponent('Picker');
  PickerMock.Item = createMockComponent('PickerItem');

  return {
    Picker: PickerMock,
  };
});

jest.mock('@react-native-community/datetimepicker', () => createMockComponent('DateTimePicker'));

jest.mock('../../theme', () => ({
  theme: {
    colors: {
      completedText: '#ffffff',
      background: '#000000',
      text: '#ffffff',
      selectorBackground: '#111111',
      border: '#222222',
      primary: '#00ff00',
      secondary: '#0000ff',
    },
    spacing: { m: 8, l: 12 },
    radii: { m: 4, l: 8 },
  },
}));

jest.mock('../../utils/responsive', () => ({
  hs: (value: number) => value,
  vs: (value: number) => value,
  ms: (value: number) => value,
}));

declare const global: any;

describe('TaskDetailsModal', () => {
  beforeAll(() => {
    global.alert = jest.fn();
  });

  it('renders without crashing', () => {
    const task: Task = {
      id: 1,
      title: 'Original task',
      completed: false,
      priority: 'urgent',
      type: 'professional',
      category: 'Profissional',
      recurrence: '0',
      dueDate: new Date().toISOString(),
      details: 'Original details',
      tags: ['home'],
    };

    const onSave = jest.fn();
    const onClose = jest.fn();

    const tree = renderer.create(
      <TaskDetailsModal
        visible
        task={task}
        onSave={onSave}
        onClose={onClose}
        allTasks={[task]}
      />
    );

    expect(tree).toBeDefined();
    expect(onSave).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });
});
