import type { BarCodeReadEvent } from 'react-native-camera'

import { Agent, ConnectionState } from '@aries-framework/core'
import { useAgent, useConnectionById } from '@aries-framework/react-hooks'
import { useNavigation } from '@react-navigation/core'
import { StackNavigationProp } from '@react-navigation/stack'
import { parseUrl } from 'query-string'
import React, { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Toast from 'react-native-toast-message'

import { Context } from '../store/Store'
import { DispatchAction } from '../store/reducer'
import { QrCodeScanError } from '../types/erorr'

import { QRScanner } from 'components'
import { ToastType } from 'components/toast/BaseToast'
import { HomeStackParams } from 'types/navigators'

interface ScanProps {
  navigation: StackNavigationProp<HomeStackParams, 'Home'>
}

const Scan: React.FC<ScanProps> = ({ navigation }) => {
  const { agent } = useAgent()
  const { t } = useTranslation()
  const [_, dispatch] = useContext(Context)
  const nav = useNavigation()

  const [qrCodeScanError, setQrCodeScanError] = useState<QrCodeScanError | null>(null)
  const [connectionId, setConnectionId] = useState('')
  const connection = useConnectionById(connectionId)

  //

  // const onSkipTouched = () => {
  //   dispatch({
  //     type: DispatchAction.SetTutorialCompletionStatus,
  //     payload: [{ DidCompleteTutorial: true }],
  //   })

  //   nav.navigate(Screens.Terms)
  // }
  //

  const displayPendingMessage = (): void => {
    dispatch({
      type: DispatchAction.ConnectionPending,
      payload: { blarb: true },
    })

    // Toast.show({
    //   type: ToastType.Info,
    //   text1: t('Global.Info'),
    //   text2: t('Scan.AcceptingConnection'),
    // })
  }

  const displaySuccessMessage = (): void => {
    dispatch({
      type: DispatchAction.ConnectionEstablished,
      payload: { blarb: true },
    })

    // Toast.show({
    //   type: ToastType.Success,
    //   text1: t('Global.Success'),
    //   text2: t('Scan.ConnectionAccepted'),
    // })
  }

  const isRedirecton = (url: string): boolean => {
    const queryParams = parseUrl(url).query
    return !(queryParams['c_i'] || queryParams['d_m'])
  }

  const handleRedirection = async (url: string, agent?: Agent): Promise<void> => {
    const res = await fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    })
    const message = await res.json()
    // TODO: Change to a full screen modal
    displayPendingMessage()
    await agent?.receiveMessage(message)
  }

  const handleInvitation = async (url: string): Promise<void> => {
    // TODO: Change to a full screen modal
    displayPendingMessage()
    const connectionRecord = await agent?.connections.receiveInvitationFromUrl(url, {
      autoAcceptConnection: true,
    })
    if (!connectionRecord?.id) {
      throw new Error(t('Scan.ConnectionNotFound'))
    }
    setConnectionId(connectionRecord.id)
  }

  useEffect(() => {
    if (connection?.state === ConnectionState.Complete) {
      Toast.show({
        type: ToastType.Success,
        text1: t('Global.Success'),
        text2: t('Scan.ConnectionAccepted'),
      })
      navigation.navigate('Home')
    }
  }, [connection])

  const handleCodeScan = async (event: BarCodeReadEvent) => {
    setQrCodeScanError(null)

    try {
      const url = event.data
      if (isRedirecton(url)) {
        await handleRedirection(url, agent)
      } else {
        await handleInvitation(url)
      }

      // TODO: Change to a full screen modal
      displaySuccessMessage()

      navigation.navigate('Home')
    } catch (e: unknown) {
      const error = new QrCodeScanError(t('Scan.InvalidQrCode'), event.data)
      setQrCodeScanError(error)
    }
  }

  return <QRScanner handleCodeScan={handleCodeScan} error={qrCodeScanError} enableCameraOnError={true} />
}

export default Scan
