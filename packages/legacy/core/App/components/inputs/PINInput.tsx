import React, { useState, forwardRef } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { CodeField, Cursor, useClearByFocusCell } from 'react-native-confirmation-code-field'
import Icon from 'react-native-vector-icons/MaterialIcons'

import { hitSlop, minPINLength } from '../../constants'
import { useTheme } from '../../contexts/theme'
import { testIdWithKey } from '../../utils/testable'
import { ImageBackgroundComponent } from 'react-native'

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
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        flexWrap: 'wrap',
        width: '100%',
        flex: 1,
        marginBottom: 24,
      },
      labelAndFieldContainer: {
        flexGrow: 1,
        width: '80%',
        boxSizing: 'border-box',
      },
      codeFieldRoot: {
        borderRadius: 5,
        paddingHorizontal: 12,
        paddingVertical: 4,
        justifyContent: 'flex-start',
        width: '100%',
        ...PINInputTheme.cell,
      },
      cell: {
        height: cellHeight,
        flex: 1,
        paddingHorizontal: 2,
        backgroundColor: PINInputTheme.cell.backgroundColor,
      },
      cellText: {
        ...TextTheme.headingThree,
        color: PINInputTheme.cellText.color,
        textAlign: 'center',
        lineHeight: cellHeight,
      },
      hideIcon: {
        flexShrink: 1,
        alignSelf: 'center',
        paddingLeft: 15,
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
            rootStyle={style.codeFieldRoot}
            onChangeText={onChangeText}
            cellCount={minPINLength}
            keyboardType="numeric"
            textContentType="password"
            renderCell={({ index, symbol, isFocused }) => {
              let child: React.ReactNode | string = ''
              if (symbol) {
                child = showPIN ? symbol : '●'
              } else if (isFocused) {
                child = <Cursor />
              }
              return (
                <View key={index} style={style.cell} onLayout={getCellOnLayoutHandler(index)}>
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
            hitSlop={hitSlop}
          >
            <Icon color={PINInputTheme.icon.color} name={showPIN ? 'visibility-off' : 'visibility'} size={30}></Icon>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
)

export default PINInput
