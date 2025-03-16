import React, {useState} from 'react';
import {View, TextInput, Text, StyleSheet} from 'react-native';
import {useTheme} from '../../contexts/ThemeContext';

const Input = ({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType = 'default',
  secureTextEntry = false,
  error,
  multiline = false,
  numberOfLines = 1,
  maxLength,
  style,
  inputStyle,
  labelStyle,
  autoCapitalize = 'none',
  ...props
}) => {
  const {theme} = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[styles.label, {color: theme.colors.text}, labelStyle]}>
          {label}
        </Text>
      )}
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.white,
            color: theme.colors.text,
            borderColor: error
              ? theme.colors.danger
              : isFocused
              ? theme.colors.primary
              : theme.colors.border,
            height: multiline ? numberOfLines * 24 : 50,
            textAlignVertical: multiline ? 'top' : 'center',
          },
          inputStyle,
        ]}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.gray}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        multiline={multiline}
        numberOfLines={multiline ? numberOfLines : 1}
        maxLength={maxLength}
        autoCapitalize={autoCapitalize}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
      {error && <Text style={[styles.error, {color: theme.colors.danger}]}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 6,
    fontSize: 14,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  error: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default Input; 