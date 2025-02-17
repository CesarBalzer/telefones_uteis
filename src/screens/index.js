import React from 'react';
import ConfirmNewEmailScreen from './screens/edit/changeEmail/ConfirmNewEmailScreen';
import ConfirmNewPhoneNumberScreen from './screens/edit/changePhoneNumber/ConfirmNewPhoneNumberScreen';
import ExistingAccount from './screens/signUp/ExistingAccount';
import AccountTypeStep from './screens/signUp/AccountTypeStep';
import NameStep from './screens/signUp/NameStep';
import PhoneNumberStep from './screens/signUp/PhoneNumberStep';
import ConfirmPhoneNumberStep from './screens/signUp/ConfirmPhoneNumberStep';
import EmailStep from './screens/signUp/EmailStep';
import ConfirmEmailStep from './screens/signUp/ConfirmEmailStep';
import PasswordStep from './screens/signUp/PasswordStep';
import DocumentsIntroStep from './screens/signUp/DocumentsIntroStep';
import SendSelfie from './screens/signUp/SendSelfie';
import CloseAccountScreen from './screens/signUp/CloseAccountScreen';
import EditDataScreen from './screens/EditDataScreen';
import EditRegistrationScreen from './screens/edit/EditRegistrationScreen';
import EditAccessDataScreen from './screens/edit/EditAccessDataScreen';
import EditAddressScreen from './screens/edit/EditAddressScreen';
import ChangeEmailScreen from './screens/edit/ChangeEmailScreen';
import ChangePhoneNumberScreen from './screens/edit/ChangePhoneNumberScreen';
import RegisterUpdate from './screens/RegisterUpdate';
import SecurityScreen from './screens/SecurityScreen';
import EditPasswordScreen from './screens/security/EditPasswordScreen';
import BiometricAccessScreen from './screens/security/BiometricAccessScreen';
import InviteScreen from './screens/InviteScreen';
import HelpScreen from './screens/HelpScreen';
import BankStatementScreen from './screens/statements/BankStatementScreen';
import QRCodeScreen from './screens/QRCodeScreen';
import PaymentScreen from './screens/PaymentScreen';
import PaymentConfirmationScreen from './screens/payment/PaymentConfirmationScreen';
import MyAccountScreen from './screens/MyAccountScreen';
import SendDocumentsStep from './screens/signUp/SendDocumentsStep';
import FinalStep from './screens/signUp/FinalStep';
import LoginScreen from './screens/login/LoginScreen';
import HomeScreen from './screens/home/HomeScreen';
import WaitingScreen from './screens/signUp/WaitingScreen';
import CnpjStep from './screens/signUp/CnpjStep';
import CpfStep from './screens/signUp/CpfStep';
import TransferScreen from './screens/TransferScreen';
import SchedulesScreen from './screens/SchedulesScreen';
import IssueBillet from './screens/IssueBilletScreen';
import ReceiptScreen from './screens/ReceiptScreen';
import ReceiptsScreen from './screens/ReceiptsScreen';
import CardsScreen from './screens/CardsScreen';
import PasswordRecoveryScreen from './screens/passwordRecovery/PasswordRecoveryScreen';
import UpdatePasswordScreen from './screens/passwordRecovery/UpdatePasswordScreen';
import OutDatedScreen from './screens/OutDatedScreen';
import FourDigitsPasswordScreen from './screens/security/FourDigitsPasswordScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import AddBalanceScreen from './screens/AddBalanceScreen';
import CardStatementScreen from './screens/cards/CardStatementScreen';
import ChargeCardScreen from './screens/cards/ChargeCardScreen';
import DebitCardScreen from './screens/cards/DebitCardScreen';
import PixScreen from './screens/PixScreen';
import PixKeysScreen from './screens/pix/PixKeysScreen';
import AddKeyScreen from './screens/pix/AddKeyScreen';
import SelectKeyTypeScreen from './screens/pix/keyPayment/SelectKeyTypeScreen';
import PixAmountInputScreen from './screens/pix/keyPayment/PixAmountInputScreen';
import PixConfirmationScreen from './screens/pix/keyPayment/PixConfirmationScreen';
import QRCodePaymentScreen from './screens/pix/QRCodePaymentScreen';
import ReceivePixScreen from './screens/pix/receivePix/ReceivePixScreen';
import SelectKeyScreen from './screens/pix/receivePix/SelectKeyScreen';
import PixQrCodeScreen from './screens/pix/receivePix/PixQrCodeScreen';
import ActivateCardScreen from './screens/cards/ActivateCardScreen';
import CardActivatedScreen from './screens/cards/CardActivatedScreen';
import CardSafetyDataScreen from './screens/cards/CardSafetyDataScreen';
import ChooseCardNameScreen from './screens/cards/ChooseCardNameScreen';
import RequestCardScreen from './screens/cards/RequestCardScreen';
import UpdateChangeCardsScreen from './screens/cards/UpdateChangeCardsScreen';
import BenefitsCardsScreen from './screens/cards/BenefitsCardsScreen';
import RedeenCardBalanceScreen from './screens/cards/RedeenCardBalanceScreen';
import PixWelcomeScreen from './screens/pix/PixWelcomeScreen';
import PixLimitsScreen from './screens/pix/PixLimitsScreen';
import PixKeysWelcomeScreen from './screens/pix/PixKeysWelcomeScreen';
import PixKeyScreen from './screens/pix/keys/PixKeyScreen';
import PayBackScreen from './screens/pix/PayBackScreen';
import PixQrCodeConfirmationScreeen from './screens/pix/keyPayment/PixQrCodeConfirmationScreeen';
import QrCodeReceiptScreen from './screens/pix/keyPayment/QrCodeReceiptScreen';
import NotificationsScreen from './screens/notifications/NotificationsScreen';
import ResendDocumentsScreen from './screens/registerUpdate/ResendDocumentsScreen';
import ResendSelfieScreen from './screens/registerUpdate/ResendSelfieScreen';
import AddressStep from './screens/signUp/AddressStep';
import ZipCodeStep from './screens/signUp/ZipCodeStep';
import ConfirmAddressScreen from './screens/cards/ConfirmAddressScreen';
import DevicesScreen from './screens/devices/DevicesScreen';
import DeviceActivationScreen from './screens/devices/DeviceActivationScreen';
import DuplicateCardScreen from './screens/cards/DuplicateCardScreen';
import SelectPixFavoredScreen from './screens/pix/keyPayment/SelectPixFavoredScreen';
import PersonalDataStep from './screens/signUp/PersonalDataStep';
import AccountPlanLimitsScreen from './screens/AccountPlanLimitsScreen';
import ReportIncomeScreen from './screens/reports/ReportIncomeScreen';
import ChangeAccount from './screens/account/ChangeAccount';
//RECOVERY SHORT PASSWORD
import RecoveryIntroScreen from './screens/shortPassRecovery/RecoveryIntroScreen';
import RecoverySendDocument from './screens/shortPassRecovery/RecoverySendDocument';
import RecoverySendSelfie from './screens/shortPassRecovery/RecoverySendSelfie';
import RecoverySendRequest from './screens/shortPassRecovery/RecoverySendRequest';
import RecoveryAwaitRequest from './screens/shortPassRecovery/RecoveryAwaitRequest';
import AppIntro from './components/Intro/AppIntro';

import TokenScreen from './screens/2fa/TokenScreen';

const SingUpComponents = [
  { name: 'AccountTypeStep', component: AccountTypeStep },
  { name: 'CpfStep', component: CpfStep },
  { name: 'CnpjStep', component: CnpjStep },
  { name: 'NameStep', component: NameStep },
  { name: 'PhoneNumberStep', component: PhoneNumberStep },
  { name: 'ConfirmPhoneNumberStep', component: ConfirmPhoneNumberStep },
  { name: 'EmailStep', component: EmailStep },
  { name: 'ConfirmEmailStep', component: ConfirmEmailStep },
  { name: 'ZipCodeStep', component: ZipCodeStep },
  { name: 'AddressStep', component: AddressStep },
  { name: 'PersonalDataStep', component: PersonalDataStep },
  { name: 'PasswordStep', component: PasswordStep },
  { name: 'DocumentsIntroStep', component: DocumentsIntroStep },
  { name: 'SendDocumentsStep', component: SendDocumentsStep },
  { name: 'SendSelfie', component: SendSelfie },
  { name: 'ExistingAccount', component: ExistingAccount },
  { name: 'FinalStep', component: FinalStep, headerShown: false },
];

const BasicScreens = [
  { name: 'MyAccount', title: 'Minha conta', component: MyAccountScreen },
  { name: 'EditData', title: 'Editar dados', component: EditDataScreen },
  {
    name: 'EditRegistration',
    title: 'Cadastro',
    component: EditRegistrationScreen,
  },
  {
    name: 'EditAddress',
    title: 'Dados de cadastro',
    component: EditAddressScreen
  },
  {
    name: 'EditAccessData',
    title: 'Dados de acesso',
    component: EditAccessDataScreen,
  },
  {
    name: "CloseAccount",
    title: "Encerrar Conta",
    component: CloseAccountScreen
  },
  { name: 'ChangeEmail', title: 'Alterar e-mail', component: ChangeEmailScreen },
  {
    name: 'ConfirmNewEmail',
    title: 'Alterar e-mail',
    component: ConfirmNewEmailScreen,
  },
  {
    name: 'ChangePhoneNumber',
    title: 'Alterar número',
    component: ChangePhoneNumberScreen,
  },
  {
    name: 'ConfirmNewPhoneNumber',
    title: 'Alterar número',
    component: ConfirmNewPhoneNumberScreen,
  },
  {
    name: 'RegisterUpdate',
    title: 'Atualização de cadastro',
    component: RegisterUpdate,
  },
  {
    name: 'ResendDocuments',
    title: 'Enviar documento',
    component: ResendDocumentsScreen,
  },
  {
    name: 'ResendSelfie',
    title: 'Enviar selfie',
    component: ResendSelfieScreen,
  },
  { name: 'Security', title: 'Segurança', component: SecurityScreen },
  { name: 'EditPassword', title: 'Alterar senha', component: EditPasswordScreen },
  {
    name: 'BiometricAccess',
    title: 'Acesso com biometria',
    component: BiometricAccessScreen,
  },
  { name: 'Invite', title: 'Convidar', component: InviteScreen },
  { name: 'Help', title: 'Atendimento', component: HelpScreen },
  { name: 'ReportIncome', title: 'Informe de rendimentos', component: ReportIncomeScreen },
  {
    name: 'BankStatement',
    title: 'Extrato',
    component: BankStatementScreen,
  },
  {
    name: 'Receipt',
    title: 'Comprovante de transação',
    component: ReceiptScreen,
  },
  {
    name: 'QRCode',
    title: 'Pagar ou receber',
    component: QRCodeScreen,
  },
  {
    name: 'Payment',
    title: 'Pagamento',
    component: PaymentScreen,
  },
  {
    name: 'PaymentConfirmation',
    title: 'Pagamento',
    component: PaymentConfirmationScreen,
  },
  {
    name: 'Tranfer',
    title: 'Transferência',
    component: TransferScreen,
  },
  {
    name: 'Schedules',
    title: 'Agendamentos',
    component: SchedulesScreen,
  },
  {
    name: 'IssueBillet',
    title: 'Emitir boletos',
    component: IssueBillet,
  },
  {
    name: 'Receipts',
    title: 'Comprovantes',
    component: ReceiptsScreen,
  },
  {
    name: 'Cards',
    title: 'Meus cartões',
    component: CardsScreen,
  },
  {
    name: 'AddBalance',
    title: 'Adicionar Saldo',
    component: AddBalanceScreen,
  },
  {
    name: 'CardStatement',
    title: 'Movimentação',
    component: CardStatementScreen,
  },
  {
    name: 'ActivateCard',
    title: 'Ativar cartão',
    component: ActivateCardScreen,
  },
  {
    name: 'ChargeCard',
    title: 'Adicionar saldo',
    component: ChargeCardScreen,
  },
  {
    name: 'DebitCard',
    title: 'Transferir para conta digital',
    component: DebitCardScreen,
  },
  {
    name: 'Pix',
    title: 'Pix',
    component: PixScreen,
  },
  {
    name: 'PixWelcome',
    title: 'Bem-vindo ao Pix',
    component: PixWelcomeScreen,
  },
  {
    name: 'PixKeys',
    title: 'Minhas chaves',
    component: PixKeysScreen,
  },
  {
    name: 'AddKey',
    title: 'Cadastrar chave',
    component: AddKeyScreen,
  },
  {
    name: 'SelectKeyType',
    title: 'Enviar Pix',
    component: SelectKeyTypeScreen,
  },
  {
    name: 'PixAmountInput',
    title: 'Enviar Pix',
    component: PixAmountInputScreen,
  },
  {
    name: 'PixConfirmation',
    title: 'Revisão',
    component: PixConfirmationScreen,
  },
  {
    name: 'QRCodePayment',
    title: 'Pagar com QR Code',
    component: QRCodePaymentScreen,
  },
  {
    name: 'ReceivePix',
    title: 'Receber Pix',
    component: ReceivePixScreen,
  },
  {
    name: 'SelectKey',
    title: 'Receber Pix',
    component: SelectKeyScreen,
  },
  {
    name: 'PixQrCode',
    title: 'Compartilhar QR Code',
    component: PixQrCodeScreen,
  },
  {
    name: 'PixLimits',
    title: 'Meus limites Pix',
    component: PixLimitsScreen,
  },
  {
    name: 'PixKeysWelcome',
    title: 'Minhas chaves',
    component: PixKeysWelcomeScreen,
  },
  {
    name: 'PixKey',
    title: 'Chave',
    component: PixKeyScreen,
  },
  {
    name: 'PayBack',
    title: 'Devolver Pix',
    component: PayBackScreen,
  },
  {
    name: 'PixQrCodeConfirmation',
    title: 'Pix com QR Code',
    component: PixQrCodeConfirmationScreeen,
  },
  {
    name: 'SelectPixFavored',
    title: 'Selecione um favorito',
    component: SelectPixFavoredScreen,
  },
  {
    name: 'QrCodeReceipt',
    title: 'Comprovante',
    component: QrCodeReceiptScreen,
  },
  {
    name: 'CardActivated',
    title: 'Cartão ativado',
    component: CardActivatedScreen,
  },
  {
    name: 'CardSafetyData',
    title: 'Dados do cartão',
    component: CardSafetyDataScreen,
  },
  {
    name: 'ConfirmAddress',
    title: 'Endereço de entrega',
    component: ConfirmAddressScreen,
  },
  {
    name: 'ChooseCardName',
    title: 'Nome no cartão',
    component: ChooseCardNameScreen,
  },
  {
    name: 'RequestCard',
    title: 'Solicitar cartão',
    component: RequestCardScreen,
  },
  {
    name: 'UpdateChangeCards',
    title: 'Atualizar cartão',
    component: UpdateChangeCardsScreen,
  },
  {
    name: 'BenefitsCards',
    title: 'Benefícios',
    component: BenefitsCardsScreen,
  },
  {
    name: 'RedeenCardBalance',
    title: 'Resgatar saldo de cartão',
    component: RedeenCardBalanceScreen,
  },
  {
    name: 'DuplicateCard',
    title: 'Pedir 2ª via',
    component: DuplicateCardScreen,
  },
  {
    name: 'Notifications',
    title: 'Notificações',
    component: NotificationsScreen,
  },
  {
    name: 'Devices',
    title: 'Dispositivos',
    component: DevicesScreen,
  },
  {
    name: 'DeviceActivation',
    title: 'Ativar novo dispositivo',
    component: DeviceActivationScreen,
  },
  {
    name: 'AccountPlanLimits',
    title: 'Limites da conta',
    component: AccountPlanLimitsScreen,
  },
  {
    name: 'RecoveryIntro',
    title: 'Recuperação de senha',
    component: RecoveryIntroScreen,
  },
  {
    name: 'RecoverySendDocument',
    title: 'Recuperação de senha',
    component: RecoverySendDocument,
  },
  {
    name: 'RecoverySendSelfie',
    title: 'Recuperação de senha',
    component: RecoverySendSelfie,
  },
  {
    name: 'RecoverySendRequest',
    title: 'Recuperação de senha',
    component: RecoverySendRequest,
  },
  {
    name: 'RecoveryAwaitRequest',
    title: 'Recuperação de senha',
    component: RecoveryAwaitRequest,
  },
  {
    name: 'ChangeAccount',
    title: 'Trocar de conta',
    component: ChangeAccount,
  },
  {
    name: 'Token',
    title: 'MK Token',
    component: TokenScreen,
  },
];

export const createStacks = MainStack => {
  return {
    renderUserScreens: user => {
      return (
        <>
          {!user.is_short_password_defined && (
            <MainStack.Screen
              name="FourDigitsPassword"
              component={FourDigitsPasswordScreen}
              options={{ headerShown: false }}
            />
          )}

          <MainStack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
          {BasicScreens.map(screen => (
            <MainStack.Screen
              key={screen.name}
              name={screen.name}
              component={screen.component}
              options={{
                title: screen.title,
              }}
            />
          ))}
        </>
      );
    },

    renderSingUpScrens: () => {
      return (
        <>
          {SingUpComponents.map(screen => (
            <MainStack.Screen
              key={screen.name}
              name={screen.name}
              component={screen.component}
              options={{
                title: 'Abrir nova conta',
                headerShown:
                  typeof screen.headerShown == 'undefined'
                    ? true
                    : screen.headerShown,
              }}
            />
          ))}
        </>
      );
    },

    renderLoginScreens: () => {
      return (
        <>
          <MainStack.Screen
            name="Login"
            component={LoginScreen}
            options={{
              headerShown: false,
              animationTypeForReplace: 'pop',
            }}
          />
          <MainStack.Screen
            name="PasswordRecovery"
            component={PasswordRecoveryScreen}
            options={{
              title: 'Recuperar senha',
            }}
          />
          <MainStack.Screen
            name="UpdatePassword"
            component={UpdatePasswordScreen}
            options={{
              title: 'Definir nova senha',
            }}
          />
          <MainStack.Screen
            name="Help"
            component={HelpScreen}
            options={{
              title: 'Atendimento',
            }}
          />
        </>
      );
    },

    renderWaitingScreens: () => {
      return (
        <MainStack.Screen
          name="Waiting"
          component={WaitingScreen}
          options={{
            headerShown: false,
          }}
        />
      );
    },

    renderOutDatedScreens: () => {
      return (
        <MainStack.Screen
          name="OutDated"
          component={OutDatedScreen}
          options={{
            headerShown: false,
          }}
        />
      );
    },

    renderWelcomeScreens: () => {
      return (
        <MainStack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{
            headerShown: false,
          }}
        />
      );
    },
    renderIntroScreen: () => {
      return (
        <MainStack.Screen
          name="AppIntro"
          component={AppIntro}
          options={{
            headerShown: false,
          }}
        />
      );
    },
  };
};
