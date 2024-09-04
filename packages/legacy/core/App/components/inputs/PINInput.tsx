import React, { useState, forwardRef, Ref } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { CodeField, useClearByFocusCell } from 'react-native-confirmation-code-field'
import Icon from 'react-native-vector-icons/MaterialIcons'

import { minPINLength } from '../../constants'
import { useTheme } from '../../contexts/theme'
import { testIdWithKey } from '../../utils/testable'

interface PINInputProps {
  label?: string
  onPINChanged?: (PIN: string) => void
  testID?: string
  accessibilityLabel?: string
  autoFocus?: boolean
}

  // TODO:(jl) Would be great if someone can figure out the proper type for
// ref below.
const PINInput: React.FC<PINInputProps & React.RefAttributes<TextInput>> = forwardRef(
  ({ label, onPINChanged, testID, accessibilityLabel, autoFocus = false }, ref: React.Ref<TextInput>) => {
    // const accessible = accessibilityLabel && accessibilityLabel !== '' ? true : false
    const { ColorPallet } = useTheme()
    const [PIN, setPIN] = useState('')
    const [showPIN, setShowPIN] = useState(false)
    const { t } = useTranslation()
    const { TextTheme, PINInputTheme } = useTheme()
    const cellHeight = 48
    const onChangeText = (value: string) => {
      onPINChanged && onPINChanged(value)
      setPIN(value)
    }
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
      value: PIN,
      setValue: onChangeText,
    })

    const style = StyleSheet.create({
      container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '100%',
        flex: 1,
        marginBottom: 24,
      },
      labelAndFieldContainer: {
        flexGrow: 1,
        width: '80%',
      },
      cell: {
        borderRadius: 5,
        height: cellHeight,
        width: 40,
        paddingHorizontal: 10,
        backgroundColor: PINInputTheme.cell.backgroundColor,
      },
      cellText: {
        fontSize: 26,
        fontWeight: '200',
        color: PINInputTheme.cellText.color,
        textAlign: 'center',
        textAlignVertical: 'center',
      },
      focusedCell: {
        borderWidth: 2,
        borderColor: ColorPallet.grayscale.mediumGrey,
      },
      hideIcon: {
        flexShrink: 1,
        marginVertical: 10,
        marginLeft: 10,
        paddingHorizontal: 10,
      },
    })

    return (
      <View style={style.container}>
        {label && <Text style={[TextTheme.label, { marginBottom: 8 }]}>{label}</Text>}
        <View style={style.labelAndFieldContainer}>
          <CodeField
            {...props}
            testID={testID}
            accessibilityLabel={accessibilityLabel}
            accessible
            value={PIN}
            onChangeText={onChangeText}
            cellCount={minPINLength}
            keyboardType="numeric"
            textContentType="password"
            renderCell={({ index, symbol, isFocused }) => {
              let child: React.ReactNode | string = ''
              if (symbol) {
                child = showPIN ? symbol : '●'
              }
              return (
                <View key={index} style={[style.cell, isFocused && style.focusedCell]} onLayout={getCellOnLayoutHandler(index)}>
                  <Text style={style.cellText} maxFontSizeMultiplier={1}>
                    {child}
                  </Text>
                </View>
              )
            }}
            autoFocus={autoFocus}
            ref={ref}
          >         
          </CodeField>
        </View>
        <View style={style.hideIcon}>
          <TouchableOpacity
            accessibilityLabel={showPIN ? t('PINCreate.Hide') : t('PINCreate.Show')}
            accessibilityRole={'button'}
            testID={showPIN ? testIdWithKey('Hide') : testIdWithKey('Show')}
            onPress={() => setShowPIN(!showPIN)}
          >
            <Icon color={PINInputTheme.icon.color} name={showPIN ? 'visibility-off' : 'visibility'} size={30}></Icon>
          </TouchableOpacity>
        </View>
      </View>
      <View style={style.hideIcon}>
        <TouchableOpacity
          accessibilityLabel={showPIN ? t('PINCreate.Hide') : t('PINCreate.Show')}
          accessibilityRole={'button'}
          testID={showPIN ? testIdWithKey('Hide') : testIdWithKey('Show')}
          onPress={() => setShowPIN(!showPIN)}
          hitSlop={hitSlop}
        >
          <Icon color={PINInputTheme.icon.color} name={showPIN ? 'visibility-off' : 'visibility'} size={30}></Icon>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const PINInput = forwardRef<TextInput, PINInputProps>(PINInputComponent)

PINInput.displayName = "PINInput"

export default PINInput
