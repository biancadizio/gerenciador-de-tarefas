import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker'; 
import { theme } from '../theme';
import { Task } from '../types/types'; 
import { sanitizeTaskTitle, TASK_TITLE_MAX_LENGTH, validateTaskTitle } from '../utils/taskValidation';
import { formatTaskTags, parseTaskTags, TASK_TAGS_MAX_LENGTH } from '../utils/taskTags';



interface TaskDetailsModalProps {
  /** Controls whether the modal is visible. */
  visible: boolean;
  /** Task currently being edited. */
  task: Task;
  /** Saves the edited task back to the task list hook. */
  onSave: (updatedTask: Task) => void;
  /** Closes the modal without persisting local form edits. */
  onClose: () => void;
  /** Full task list, available for relationship-oriented features. */
  allTasks: Task[];
}

/**
 * Modal form used to edit task metadata such as title, priority, deadline,
 * category, tags, recurrence, and details.
 */
const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({
  visible,
  task,
  onSave,
  onClose,
  allTasks,
}) => {
  const [formData, setFormData] = useState<Task>(task);  
  const [customValue, setCustomValue] = useState(''); // Armazena valor personalizado digitado pelo usuário (em dias)
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tagsInput, setTagsInput] = useState('');

  // Quando o modal abre, inicializa os estados
  useEffect(() => {
    setFormData(task);
    setTagsInput(formatTaskTags(task.tags));

    // Se a task tiver um tipo não padronizado, tratamos como ''
    if (!['0', '1', '7', '30', '180', '365'].includes(task.recurrence || '')) {
      setCustomValue(task.recurrence || '');
      setFormData((prev) => ({ ...prev, recurrence: ''}));
    } else {
      setCustomValue('');
    }
  }, [task]);

  // Lida com a seleção no Picker
  const handlePickerChange = (value: string) => {
    setFormData({ ...formData, recurrence: value });

    // Se a escolha for 'custom', deixamos o valor anterior como está
    if (value !== 'custom') {
      setCustomValue('');
    }
  };
  
  // Atualiza valor personalizado manualmente digitado
  const handleCustomValueChange = (value: string) => {
    setCustomValue(value);
  };

  const handleSaveTitle = () => {
    const validationError = validateTaskTitle(formData.title);

    if (validationError) {
      alert(validationError);
      return;
    }

    onSave({
      ...formData,
      title: sanitizeTaskTitle(formData.title),
      tags: parseTaskTags(tagsInput),
    });
  };

 
  // Ao salvar, se for personalizado, usamos customValue como type
 const handleSave = () => {
  const parsedValue = parseInt(customValue);

  // Validações obrigatórias
  if (!formData.title || formData.title.trim() === '') {
    alert('O título da tarefa é obrigatório.');
    return;
  }

  if (!formData.priority) {
    alert('Selecione uma prioridade.');
    return;
  }

  // Validação: Data dentro de 10 anos para frente e para trás
  if (formData.dueDate) {
    const dueDate = new Date(formData.dueDate);
    const now = new Date();
    const minDate = new Date(now.getFullYear() - 10, now.getMonth(), now.getDate());
    const maxDate = new Date(now.getFullYear() + 10, now.getMonth(), now.getDate());

    if (dueDate < minDate || dueDate > maxDate) {
      alert('A data deve estar entre 10 anos atrás e 10 anos no futuro.');
      return;
    }
  }
  else{
    alert('Digite uma data.');
  }

  if (!formData.category) {
    alert('Selecione uma categoria.');
    return;
  }
  
  if (!formData.recurrence) {
    alert('Selecione uma periodicidade.');
    return;
  }

  // Validação de valor personalizado
  if (formData.recurrence === 'custom') {
    if (isNaN(parsedValue) || parsedValue < 0) {
      alert('Informe um número válido maior ou igual a 0 para a recorrência.');
      return;
    }
  }

  const finalType =
    formData.recurrence === 'custom'
      ? parsedValue.toString()
      : formData.recurrence;

    onSave({ ...formData, recurrence: finalType });

    // Limpa os estados
    setFormData((prev) => ({
      ...prev,
      title: '',
      details: '',
      priority: undefined,
      category: "Selecione Categoria",
      dueDate: undefined,
      recurrence: "Selecione Periodicidade",
    }));

    setCustomValue('');
    setShowDatePicker(false);

  };



  const handleClose = () => {
    setFormData(task); // Reset form to original task data
    setCustomValue('');
    setTagsInput(formatTaskTags(task.tags));
    onClose(); // Close modal
  };

  // Helper for web input value format (yyyy-mm-dd)
  const getWebDateValue = () => {
    if (!formData.dueDate) return '';
    // ISO string is like 2023-05-10T00:00:00.000Z - we want just yyyy-mm-dd
    return formData.dueDate.split('T')[0];
  };

  // Ver questão da periodicidade
  
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false); 

    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      setFormData({ ...formData, dueDate: formattedDate });
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1} 
          onPressOut={onClose} 
        >
          {/* REMOVIDO: onStartShouldSetResponder={() => true} do View styles.modalContent */}
          <View style={styles.modalContent}> 
            <Text style={styles.modalTitle}>Detalhes da Task</Text>

            <TextInput
              style={styles.input}
              placeholder="Título"
              placeholderTextColor={theme.colors.completedText}
              value={formData.title}
              onChangeText={(text) => setFormData({ ...formData, title: text })}
              maxLength={TASK_TITLE_MAX_LENGTH}
            />

            <Picker
              selectedValue={formData.priority}
              onValueChange={(value) => setFormData({ ...formData, priority: value })}
              style={styles.picker}
              dropdownIconColor={theme.colors.text}
              itemStyle={styles.pickerItem}
            >
              <Picker.Item label="Selecione Prioridade" value={null} />
              <Picker.Item label="Urgente" value="urgent" />
              <Picker.Item label="Importante" value="important" />
              <Picker.Item label="Lembrar" value="remember" />
              <Picker.Item label="Sem Urgência" value="no-urgency" />
            </Picker>

          {Platform.OS === 'web' ? (
            // Web native date input
            <input
              type="date"
              value={getWebDateValue()}
              onChange={(e) =>
                setFormData({ ...formData, dueDate: e.target.value ? new Date(e.target.value).toISOString() : undefined })
              }
              style={{
                  backgroundColor: theme.colors.background,
                  padding: theme.spacing.m,
                  borderRadius: theme.radii.m,
                  marginBottom: theme.spacing.m,
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                  color: "white"
              }}
            />
          ) : (
            <>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.dateButtonText}>
                  {formData.dueDate
                    ? new Date(formData.dueDate).toLocaleDateString()
                    : 'Selecionar Data'}
                </Text>
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={formData.dueDate ? new Date(formData.dueDate) : new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, date) => {
                    setShowDatePicker(false);
                    if (date) {
                      setFormData({ ...formData, dueDate: date.toISOString() });
                    }
                  }}
                />
              )}
            </>
          )}

            <Picker
              selectedValue={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value })}
              style={styles.picker}
              dropdownIconColor={theme.colors.text}
              itemStyle={styles.pickerItem}
            >
              <Picker.Item label="Selecione Tipo" value={null} />
              <Picker.Item label="Profissional" value="professional" />
              <Picker.Item label="Pessoal" value="personal" />
              <Picker.Item label="Saúde" value="health" />
              <Picker.Item label="Educacional" value="educational" />
              <Picker.Item label="Projetos" value="projects" />
              <Picker.Item label="Outros" value="others" />
            </Picker>

          <TextInput
            style={styles.input}
            placeholder="Tags"
            placeholderTextColor={theme.colors.completedText}
            value={tagsInput}
            onChangeText={setTagsInput}
            maxLength={TASK_TAGS_MAX_LENGTH}
          />


          <Picker
            selectedValue={formData.recurrence}
            onValueChange={handlePickerChange}
            style={styles.picker}
            dropdownIconColor={theme.colors.text}
            itemStyle={styles.pickerItem}
          >
            <Picker.Item label="Selecione Periodicidade" value={null} />
            <Picker.Item label="Não se repete" value="0" />
            <Picker.Item label="A cada dia" value="1" />
            <Picker.Item label="A cada semana" value="7" />
            <Picker.Item label="A cada mês" value="30" />
            <Picker.Item label="A cada semestre" value="180" />
            <Picker.Item label="A cada ano" value="365" />
            <Picker.Item label="Outro (personalizado)" value="custom" />
          </Picker>
          
          {/* Campo visível somente se o usuário escolher "Outro" */}
          {formData.recurrence  === 'custom' && (
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Digite o número de dias de recorrência"
            value={customValue}
            onChangeText={handleCustomValueChange}
          />
          )}

          <TextInput
            style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
            placeholder="Detalhes"
            placeholderTextColor={theme.colors.completedText}
            multiline
            value={formData.details}
            onChangeText={(text) => setFormData({ ...formData, details: text })}
          />

            <View style={styles.buttonRow}>
              <TouchableOpacity 
                style={[styles.button, styles.saveButton]}
                onPress={handleSaveTitle}
              >
                <Text style={styles.buttonText}>Salvar</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]}
                onPress={onClose}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackdrop: {
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    paddingHorizontal: 50,
  },
  modalContent: {
    backgroundColor: theme.colors.inputBackground,
    borderRadius: theme.radii.l,
    padding: theme.spacing.l,
    borderWidth: 1,
    borderColor: theme.colors.border,
    zIndex: 1, // Ensure content is above the Pressable
  },
  modalTitle: {
    color: theme.colors.primary,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: theme.spacing.l,
    textAlign: 'center',
  },
  input: {
    backgroundColor: theme.colors.background,
    color: theme.colors.text,
    borderRadius: theme.radii.m,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.m,
    borderWidth: 1,
    borderColor: theme.colors.border,
    fontSize: 16,
  },
  picker: {
    backgroundColor: theme.colors.selectorBackground,
    borderRadius: theme.radii.m,
    marginBottom: theme.spacing.m,
    borderWidth: 1,
    color: theme.colors.text,
    borderColor: theme.colors.border,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  pickerItem: {
    color: theme.colors.text,
    backgroundColor: theme.colors.background,
    fontSize: 16,
  },
  dateButton: { 
    backgroundColor: theme.colors.background,
    padding: theme.spacing.m,
    borderRadius: theme.radii.m,
    marginBottom: theme.spacing.m,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  dateButtonText: {
    color: theme.colors.text,
    fontSize: 16,
  },
  dateInputContainer: { 
    marginBottom: theme.spacing.m,
    backgroundColor: theme.colors.background,
    borderRadius: theme.radii.m,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  webDateInput: { 
    backgroundColor: 'transparent', 
    color: theme.colors.text,
    padding: theme.spacing.m,
    fontSize: 16,
    borderWidth: 0, 
    width: '100%',
    height: 50, 
    boxSizing: 'border-box',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.m,
    marginTop: theme.spacing.m,
  },
  button: {
    flex: 1,
    padding: theme.spacing.m,
    borderRadius: theme.radii.m,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
  },
  cancelButton: {
    backgroundColor: theme.colors.danger,
  },
  buttonText: {
    color: theme.colors.text,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default TaskDetailsModal;
