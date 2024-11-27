import React from 'react'
import { useTranslation } from 'react-i18next'
import { Animated, TouchableOpacity, View } from 'react-native'
import { ScalingDot } from 'react-native-animated-pagination-dots'
import Icon from 'react-native-vector-icons/MaterialIcons'

import { hitSlop } from '../../constants'
import { testIdWithKey } from '../../utils/testable'

interface IPaginationStyleSheet {
  pagerContainer: Record<string, any>
  pagerDot: Record<string, any>
  pagerDotActive: Record<string, any>
  pagerDotInactive: Record<string, any>
  pagerPosition: Record<string, any>
  pagerNavigationButton: Record<string, any>
}

interface IPaginationProps {
  pages: Array<Element>
  activeIndex: number
  scrollX: Animated.Value
  next: () => void
  nextButtonText?: string
  previous: () => void
  previousButtonText?: string
  style: IPaginationStyleSheet
}

export const Pagination: React.FC<IPaginationProps> = ({
  pages,
  activeIndex,
  scrollX,
  style,
  next,
  // nextButtonText,
  previous,
  // previousButtonText,
}) => {
  const { t } = useTranslation()

  const shouldHideBack = (): boolean => {
    if (activeIndex === 0) {
      return true
    }

    return false
  }

  const shouldHideNext = (): boolean => {
    if (activeIndex === pages.length - 1) {
      return true
    }

    return false
  }

  // FIXME: Issue #204. Better to `disable` the `TouchableOpacity`
  // controls rather than changing the color to transparent.

  return (
    <View style={style.pagerContainer}>
      <TouchableOpacity
        accessible={true}
        accessibilityLabel={t('Global.Back')}
        accessibilityRole={'button'}
        testID={testIdWithKey('Back')}
        onPress={previous}
        accessibilityElementsHidden={shouldHideBack()}
        importantForAccessibility={shouldHideBack() ? 'no-hide-descendants' : 'auto'}
        hitSlop={hitSlop}
      >
        <View style={[style.pagerNavigationButton, {opacity: shouldHideBack() ? 0.0 : 1.0}]}>
          <Icon name={"chevron-left"} size={30} color="#000" />
        </View>
        {/* <Text
          style={[
            style.pagerNavigationButton,
            { paddingRight: 20, color: shouldHideBack() ? 'transparent' : style.pagerNavigationButton.color },
          ]}
        >
          {previousButtonText}
        </Text> */}
      </TouchableOpacity>
      <ScalingDot
        data={pages}
        scrollX={scrollX}
        inActiveDotColor={style.pagerDotInactive.color}
        inActiveDotOpacity={1}
        activeDotColor={style.pagerDotActive.color}
        activeDotScale={1}
        dotStyle={style.pagerDot}
        containerStyle={style.pagerPosition}
      />

      <TouchableOpacity
        accessible={true}
        accessibilityLabel={t('Global.Next')}
        accessibilityRole={'button'}
        testID={testIdWithKey('Next')}
        onPress={next}
        accessibilityElementsHidden={shouldHideNext()}
        importantForAccessibility={shouldHideNext() ? 'no-hide-descendants' : 'auto'}
        hitSlop={hitSlop}
      >
        <View style={[style.pagerNavigationButton, {opacity: shouldHideNext() ? 0.0 : 1.0}]}>
          <Icon name={"chevron-right"} size={30} color="#000" />
        </View>
        {/* <Text
          style={[
            style.pagerNavigationButton,
            { paddingLeft: 20, color: shouldHideNext() ? 'transparent' : style.pagerNavigationButton.color },
          ]}
        >
          {nextButtonText}
        </Text> */}
      </TouchableOpacity>
    </View>
  )
}
