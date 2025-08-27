<template>
  <div>
    <div class="grid gap-6">
      <div class="mb-8">
        <form @submit.prevent="handleStepAction">
          <!-- Étape 1: Informations personnelles -->
          <div v-if="currentStep === 0" class="grid gap-2">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-semibold mr-3 mb-2 w-max">Informations personnelles</h2>
              <UiSteps :current-step="currentStep" :steps="steps" />
            </div>

            <!-- Prénom et Nom sur la même ligne -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Nom -->
              <div class="grid gap-1">
                <UiLabel for="last_name">Nom</UiLabel>
                <UiInput id="last_name" placeholder="Nom" type="text" v-model="formData.last_name"
                  :class="{ 'border-red-500': formErrors.errorLastName }" />
                <span v-if="formErrors.errorLastName" class="text-xs text-red-500">
                  {{ formErrors.errorLastNameMessage }}
                </span>
              </div>

              <!-- Prénom -->
              <div class="grid gap-1">
                <UiLabel for="first_name">Prénom</UiLabel>
                <UiInput id="first_name" placeholder="Prénom" type="text" v-model="formData.first_name"
                  :class="{ 'border-red-500': formErrors.errorFirstName }" />
                <span v-if="formErrors.errorFirstName" class="text-xs text-red-500">
                  {{ formErrors.errorFirstNameMessage }}
                </span>
              </div>
            </div>

            <!-- Email -->
            <div class="grid gap-1 mt-2">
              <UiLabel for="email">Email</UiLabel>
              <UiInput id="email" placeholder="votre@email.com" type="email" auto-capitalize="none"
                auto-complete="email" auto-correct="off" v-model="formData.email"
                :class="{ 'border-red-500': formErrors.errorEmail }" />
              <span v-if="formErrors.errorEmail" class="text-xs text-red-500">
                {{ formErrors.errorEmailMessage }}
              </span>
            </div>

            <!-- Numéro de téléphone -->
            <div class="grid gap-1 mt-2">
              <UiLabel for="phone_number">Numéro de téléphone (optionnel)</UiLabel>
              <div class="flex">
                <div class="relative w-1/3">
                  <select id="country_code" v-model="selectedCountryCode"
                    class="w-full px-3 py-2 border border-input rounded-l-md"
                    :class="{ 'border-red-500': !selectedCountryCode && phoneInput }">
                    <option value="" disabled selected>Indicatif</option>
                    <option v-for="country in countriesList" :key="country.code" :value="country.phone">
                      {{ country.emoji }} +{{ country.phone }}
                    </option>
                  </select>
                </div>
                <UiInput id="phone_number" placeholder="Entrez votre numéro" type="tel" v-model="phoneInput"
                  @input="formatPhoneNumber" class="rounded-l-none w-2/3" :disabled="!selectedCountryCode"
                  :class="{ 'border-red-500': formErrors.errorPhoneNumber }" />
              </div>
              <span v-if="!selectedCountryCode && phoneInput" class="text-xs text-amber-600">
                Veuillez d'abord sélectionner un indicatif de pays
              </span>
              <span v-else-if="selectedCountryCode" class="text-xs text-gray-500 mt-1">
                Format: +{{ selectedCountryCode }} {{ phoneExample }}
              </span>
              <span v-if="formErrors.errorPhoneNumber" class="text-xs text-red-500">
                {{ formErrors.errorPhoneNumberMessage }}
              </span>
            </div>
          </div>

          <!-- Étape 2: Informations régionales -->
          <div v-if="currentStep === 1" class="grid gap-2">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-semibold mr-6">Informations régionales</h2>
              <UiSteps :current-step="currentStep" :steps="steps" />
            </div>

            <!-- Pays -->
            <div class="grid gap-1 mt-2">
              <UiLabel for="country">Pays</UiLabel>
              <div class="relative">
                <select id="country" v-model="formData.country" class="w-full px-3 py-2 border border-input rounded-md"
                  :class="{ 'border-red-500': formErrors.errorCountry }" @change="onCountryChange">
                  <option value="" disabled selected>Sélectionnez un pays</option>
                  <option v-for="country in countriesList" :key="country.code" :value="country.name">
                    {{ country.emoji }} {{ country.name }}
                  </option>
                </select>
              </div>
              <span v-if="formErrors.errorCountry" class="text-xs text-red-500">
                {{ formErrors.errorCountryMessage }}
              </span>
            </div>

            <!-- Devise -->
            <div class="grid gap-1 mt-2">
              <UiLabel for="currency">Devise</UiLabel>
              <select id="currency" v-model="formData.currency" class="w-full px-3 py-2 border border-input rounded-md"
                :class="{ 'border-red-500': formErrors.errorCurrency }">
                <option value="" disabled selected>Sélectionnez une devise</option>
                <option v-for="currency in currencies" :key="currency.code" :value="currency.code">
                  {{ currency.code }} - {{ currency.name }} ({{ currency.symbol }})
                </option>
              </select>
              <span v-if="formErrors.errorCurrency" class="text-xs text-red-500">
                {{ formErrors.errorCurrencyMessage }}
              </span>
            </div>
          </div>

          <!-- Étape 3: Sécurité du compte -->
          <div v-if="currentStep === 2" class="grid gap-2">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-semibold mr-6">Sécurité du compte</h2>
              <UiSteps :current-step="currentStep" :steps="steps" />
            </div>

            <!-- Mot de passe -->
            <div class="grid gap-1 mt-2 relative">
              <UiLabel for="password">Mot de passe</UiLabel>
              <UiInput id="password" placeholder="Mot de passe" :type="showPassword ? 'text' : 'password'"
                auto-complete="new-password" class="pr-10" v-model="formData.password"
                :class="{ 'border-red-500': formErrors.errorPassword }" />
              <button type="button" @click="showPassword = !showPassword" tabindex="-1"
                class="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground focus:outline-none">
                <Eye v-if="!showPassword" class="w-[17px]" />
                <EyeOff v-else class="w-[17px]" />
              </button>
              <span v-if="formErrors.errorPassword" class="text-xs text-red-500">
                {{ formErrors.errorPasswordMessage }}
              </span>
            </div>

            <!-- Confirmer mot de passe -->
            <div class="grid gap-1 mt-2 relative">
              <UiLabel for="confirm_password">Confirmer le mot de passe</UiLabel>
              <UiInput id="confirm_password" placeholder="Confirmer le mot de passe"
                :type="showConfirmPassword ? 'text' : 'password'" auto-complete="new-password" class="pr-10"
                v-model="formData.confirm_password" :class="{ 'border-red-500': formErrors.errorConfirmPassword }" />
              <button type="button" @click="showConfirmPassword = !showConfirmPassword" tabindex="-1"
                class="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground focus:outline-none">
                <Eye v-if="!showConfirmPassword" class="w-[17px]" />
                <EyeOff v-else class="w-[17px]" />
              </button>
              <span v-if="formErrors.errorConfirmPassword" class="text-xs text-red-500">
                {{ formErrors.errorConfirmPasswordMessage }}
              </span>
            </div>

            <!-- Message d'erreur général -->
            <div v-if="errorMessage" class="p-3 rounded bg-red-100 border border-red-300 text-red-800 mt-4">
              {{ errorMessage }}
            </div>
          </div>

          <!-- Navigation des étapes -->
          <div class="flex justify-between mt-8">
            <UiButton type="button" variant="outline" @click="prevStep" :disabled="currentStep === 0 || isLoading">
              Précédent
            </UiButton>

            <UiButton type="submit" :disabled="isLoading">
              <span v-if="isLoading" class="animate-spin mr-2">⏳</span>
              {{ isLastStep ? "S'inscrire" : 'Suivant' }}
            </UiButton>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Eye, EyeOff } from 'lucide-vue-next'
import { Button as UiButton } from '@/components/ui/button'
import { Input as UiInput } from '@/components/ui/input'
import { Label as UiLabel } from '@/components/ui/label'
import UiSteps from '@/components/ui/steps/index.vue'
import { RegisterForm } from '@/formBuilder/auth/registerForm'
import RegisterService from '@/services/auth/registerService'
import type { IRegisterBuilder } from '@/interfaces/registerInterface'
import countries from 'i18n-iso-countries'
// Importer les langues pour i18n-iso-countries
import countriesEn from 'i18n-iso-countries/langs/en.json'
import countriesFr from 'i18n-iso-countries/langs/fr.json'

export default defineComponent({
  name: 'RegisterForm',
  components: { Eye, EyeOff, UiButton, UiInput, UiLabel, UiSteps },
  created() {
    // Initialiser la bibliothèque des pays
    countries.registerLocale(countriesFr)
    countries.registerLocale(countriesEn)
    // Remplir la liste des pays
    this.initializeCountriesList()
  },
  data() {
    return {
      showPassword: false,
      showConfirmPassword: false,
      isLoading: false,
      errorMessage: '',
      currentStep: 0,
      steps: [
        { title: '', description: '' },
        { title: '', description: '' },
        { title: '', description: '' },
      ],
      formData: {
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        country: '',
        currency: '',
        password: '',
        confirm_password: '',
      },
      phoneInput: '',
      selectedCountryCode: '', // L'utilisateur doit sélectionner un code
      phoneExample: 'XX XX XX XX XX',
      countriesList: [], // Sera rempli dans created()
      countryPhoneCodes: {}, // Mapping des pays avec leurs codes téléphoniques
      currencies: [
        { code: 'EUR', name: 'Euro', symbol: '€' },
        { code: 'USD', name: 'Dollar américain', symbol: '$' },
        { code: 'GBP', name: 'Livre sterling', symbol: '£' },
        { code: 'CHF', name: 'Franc suisse', symbol: 'CHF' },
        { code: 'CAD', name: 'Dollar canadien', symbol: '$' },
        { code: 'JPY', name: 'Yen japonais', symbol: '¥' },
        { code: 'AUD', name: 'Dollar australien', symbol: '$' },
        { code: 'CNY', name: 'Yuan chinois', symbol: '¥' },
        { code: 'XOF', name: 'Franc CFA BCEAO', symbol: 'CFA' },
        { code: 'XAF', name: 'Franc CFA BEAC', symbol: 'FCFA' },
        { code: 'MAD', name: 'Dirham marocain', symbol: 'DH' },
        { code: 'DZD', name: 'Dinar algérien', symbol: 'دج' },
        { code: 'TND', name: 'Dinar tunisien', symbol: 'DT' },
        // Vous pouvez ajouter plus de devises selon vos besoins
      ],
      formErrors: {
        errorFirstName: false,
        errorLastName: false,
        errorEmail: false,
        errorPhoneNumber: false,
        errorCountry: false,
        errorCurrency: false,
        errorPassword: false,
        errorConfirmPassword: false,
      } as IRegisterBuilder,
    }
  },
  computed: {
    isLastStep(): boolean {
      return this.currentStep === this.steps.length - 1
    },
  },
  watch: {
    selectedCountryCode: {
      handler(newCode) {
        // Mettre à jour l'exemple de téléphone lorsque l'indicatif change
        if (newCode) {
          if (newCode === '33') {
            // France
            this.phoneExample = '6 12 34 56 78'
          } else if (newCode === '1') {
            // US/Canada
            this.phoneExample = '555 123 4567'
          } else if (newCode === '44') {
            // UK
            this.phoneExample = '7911 123456'
          } else if (newCode === '49') {
            // Allemagne
            this.phoneExample = '151 23456789'
          } else if (newCode === '86') {
            // Chine
            this.phoneExample = '139 1234 5678'
          } else if (newCode === '81') {
            // Japon
            this.phoneExample = '90 1234 5678'
          } else if (newCode === '55') {
            // Brésil
            this.phoneExample = '11 91234 5678'
          } else if (newCode === '91') {
            // Inde
            this.phoneExample = '98765 43210'
          } else if (newCode.length === 1) {
            this.phoneExample = 'XXX XXX XXXX'
          } else if (newCode.length === 2) {
            this.phoneExample = 'XX XXX XXXX'
          } else {
            this.phoneExample = 'X XXXX XXXX'
          }
          this.formatPhoneNumber()
        }
      },
      immediate: true,
    },
  },
  methods: {
    // Initialiser la liste des pays avec leur emoji et code téléphonique
    initializeCountriesList() {
      // Données de code téléphonique pour les pays
      const phoneCodes = {
        AF: '93',
        AL: '355',
        DZ: '213',
        AD: '376',
        AO: '244',
        AG: '1268',
        AR: '54',
        AM: '374',
        AU: '61',
        AT: '43',
        AZ: '994',
        BS: '1242',
        BH: '973',
        BD: '880',
        BB: '1246',
        BY: '375',
        BE: '32',
        BZ: '501',
        BJ: '229',
        BT: '975',
        BO: '591',
        BA: '387',
        BW: '267',
        BR: '55',
        BN: '673',
        BG: '359',
        BF: '226',
        BI: '257',
        KH: '855',
        CM: '237',
        CA: '1',
        CV: '238',
        CF: '236',
        TD: '235',
        CL: '56',
        CN: '86',
        CO: '57',
        KM: '269',
        CG: '242',
        CD: '243',
        CR: '506',
        CI: '225',
        HR: '385',
        CU: '53',
        CY: '357',
        CZ: '420',
        DK: '45',
        DJ: '253',
        DM: '1767',
        DO: '1809',
        EC: '593',
        EG: '20',
        SV: '503',
        GQ: '240',
        ER: '291',
        EE: '372',
        ET: '251',
        FJ: '679',
        FI: '358',
        FR: '33',
        GA: '241',
        GM: '220',
        GE: '995',
        DE: '49',
        GH: '233',
        GR: '30',
        GD: '1473',
        GT: '502',
        GN: '224',
        GW: '245',
        GY: '592',
        HT: '509',
        VA: '379',
        HN: '504',
        HK: '852',
        HU: '36',
        IS: '354',
        IN: '91',
        ID: '62',
        IR: '98',
        IQ: '964',
        IE: '353',
        IL: '972',
        IT: '39',
        JM: '1876',
        JP: '81',
        JO: '962',
        KZ: '7',
        KE: '254',
        KI: '686',
        KP: '850',
        KR: '82',
        KW: '965',
        KG: '996',
        LA: '856',
        LV: '371',
        LB: '961',
        LS: '266',
        LR: '231',
        LY: '218',
        LI: '423',
        LT: '370',
        LU: '352',
        MO: '853',
        MK: '389',
        MG: '261',
        MW: '265',
        MY: '60',
        MV: '960',
        ML: '223',
        MT: '356',
        MH: '692',
        MR: '222',
        MU: '230',
        MX: '52',
        FM: '691',
        MD: '373',
        MC: '377',
        MN: '976',
        ME: '382',
        MA: '212',
        MZ: '258',
        MM: '95',
        NA: '264',
        NR: '674',
        NP: '977',
        NL: '31',
        NZ: '64',
        NI: '505',
        NE: '227',
        NG: '234',
        NO: '47',
        OM: '968',
        PK: '92',
        PW: '680',
        PS: '970',
        PA: '507',
        PG: '675',
        PY: '595',
        PE: '51',
        PH: '63',
        PL: '48',
        PT: '351',
        QA: '974',
        RO: '40',
        RU: '7',
        RW: '250',
        KN: '1869',
        LC: '1758',
        VC: '1784',
        WS: '685',
        SM: '378',
        ST: '239',
        SA: '966',
        SN: '221',
        RS: '381',
        SC: '248',
        SL: '232',
        SG: '65',
        SK: '421',
        SI: '386',
        SB: '677',
        SO: '252',
        ZA: '27',
        SS: '211',
        ES: '34',
        LK: '94',
        SD: '249',
        SR: '597',
        SZ: '268',
        SE: '46',
        CH: '41',
        SY: '963',
        TW: '886',
        TJ: '992',
        TZ: '255',
        TH: '66',
        TL: '670',
        TG: '228',
        TO: '676',
        TT: '1868',
        TN: '216',
        TR: '90',
        TM: '993',
        TV: '688',
        UG: '256',
        UA: '380',
        AE: '971',
        GB: '44',
        US: '1',
        UY: '598',
        UZ: '998',
        VU: '678',
        VE: '58',
        VN: '84',
        YE: '967',
        ZM: '260',
        ZW: '263',
      }

      // Créer une liste de pays avec leurs codes, noms, emojis et codes téléphoniques
      const allCountriesObj = countries.getNames('fr')
      const countryList = []

      for (const [code, name] of Object.entries(allCountriesObj)) {
        // Convertir le code pays en emoji drapeau
        const emoji = this.getCountryFlagEmoji(code)
        const phone = phoneCodes[code] || ''

        countryList.push({
          code,
          name,
          emoji,
          phone,
        })
      }

      // Trier les pays par nom
      this.countriesList = countryList.sort((a, b) => a.name.localeCompare(b.name, 'fr'))

      // Créer un mapping des noms de pays vers leurs codes téléphoniques
      this.countriesList.forEach((country) => {
        this.countryPhoneCodes[country.name] = country.phone
      })
    },

    // Fonction pour convertir un code pays en emoji drapeau
    getCountryFlagEmoji(countryCode) {
      const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map((char) => 127397 + char.charCodeAt(0))
      return String.fromCodePoint(...codePoints)
    },

    // Lorsque le pays change dans le formulaire
    onCountryChange() {
      if (this.formData.country) {
        // Mettre à jour le code téléphonique en fonction du pays sélectionné
        this.selectedCountryCode = this.countryPhoneCodes[this.formData.country] || ''
      }
    },

    formatPhoneNumber() {
      if (!this.selectedCountryCode) return

      // Retirer tous les caractères non numériques
      const digitsOnly = this.phoneInput.replace(/\D/g, '')

      // Formater le numéro selon le pays sélectionné
      let formatted = ''

      // Appliquer différents formats selon le code du pays
      if (this.selectedCountryCode === '33') {
        // France
        // Format français: 0 XX XX XX XX
        if (digitsOnly.length > 0) formatted += digitsOnly.slice(0, 1)
        if (digitsOnly.length > 1) formatted += ' ' + digitsOnly.slice(1, 3)
        if (digitsOnly.length > 3) formatted += ' ' + digitsOnly.slice(3, 5)
        if (digitsOnly.length > 5) formatted += ' ' + digitsOnly.slice(5, 7)
        if (digitsOnly.length > 7) formatted += ' ' + digitsOnly.slice(7, 9)
      } else if (this.selectedCountryCode === '1') {
        // USA/Canada
        // Format nord-américain: XXX-XXX-XXXX
        if (digitsOnly.length > 0) formatted += digitsOnly.slice(0, 3)
        if (digitsOnly.length > 3) formatted += ' ' + digitsOnly.slice(3, 6)
        if (digitsOnly.length > 6) formatted += ' ' + digitsOnly.slice(6, 10)
      } else if (this.selectedCountryCode === '44') {
        // UK
        // Format UK: XXXX XXXXXX
        if (digitsOnly.length > 0) formatted += digitsOnly.slice(0, 4)
        if (digitsOnly.length > 4) formatted += ' ' + digitsOnly.slice(4)
      } else if (this.selectedCountryCode === '86') {
        // Chine
        // Format chinois: XXX XXXX XXXX
        if (digitsOnly.length > 0) formatted += digitsOnly.slice(0, 3)
        if (digitsOnly.length > 3) formatted += ' ' + digitsOnly.slice(3, 7)
        if (digitsOnly.length > 7) formatted += ' ' + digitsOnly.slice(7)
      } else {
        // Format générique pour les autres pays: groupes de 2-3 chiffres
        const groups = []
        let remaining = digitsOnly

        while (remaining.length > 0) {
          // Prendre 2 ou 3 chiffres à la fois
          const groupSize = remaining.length > 8 ? 3 : 2
          groups.push(remaining.substring(0, groupSize))
          remaining = remaining.substring(groupSize)
        }

        formatted = groups.join(' ')
      }

      this.phoneInput = formatted

      // Mettre à jour le formData.phone_number avec le format international
      this.formData.phone_number = digitsOnly ? `+${this.selectedCountryCode}${digitsOnly}` : ''
    },

    validateCurrentStep(): boolean {
      const registerForm = new RegisterForm()

      // Valide uniquement les champs de l'étape actuelle
      if (this.currentStep === 0) {
        registerForm
          .setFirstName(this.formData.first_name)
          .setLastName(this.formData.last_name)
          .setEmail(this.formData.email)
          .setPhoneNumber(this.formData.phone_number || null)

        this.formErrors = registerForm.builderRegisterForm()

        return !(
          this.formErrors.errorFirstName ||
          this.formErrors.errorLastName ||
          this.formErrors.errorEmail ||
          this.formErrors.errorPhoneNumber
        )
      } else if (this.currentStep === 1) {
        registerForm.setCountry(this.formData.country).setCurrency(this.formData.currency)

        this.formErrors = registerForm.builderRegisterForm()

        return !(this.formErrors.errorCountry || this.formErrors.errorCurrency)
      } else if (this.currentStep === 2) {
        registerForm
          .setPassword(this.formData.password)
          .setConfirmPassword(this.formData.confirm_password)

        this.formErrors = registerForm.builderRegisterForm()

        return !(this.formErrors.errorPassword || this.formErrors.errorConfirmPassword)
      }

      return true
    },

    validateForm(): boolean {
      // Validation complète du formulaire
      const registerForm = new RegisterForm()

      registerForm
        .setFirstName(this.formData.first_name)
        .setLastName(this.formData.last_name)
        .setEmail(this.formData.email)
        .setPhoneNumber(this.formData.phone_number || null)
        .setCountry(this.formData.country)
        .setCurrency(this.formData.currency)
        .setPassword(this.formData.password)
        .setConfirmPassword(this.formData.confirm_password)

      this.formErrors = registerForm.builderRegisterForm()

      return !(
        this.formErrors.errorFirstName ||
        this.formErrors.errorLastName ||
        this.formErrors.errorEmail ||
        this.formErrors.errorPhoneNumber ||
        this.formErrors.errorCountry ||
        this.formErrors.errorCurrency ||
        this.formErrors.errorPassword ||
        this.formErrors.errorConfirmPassword
      )
    },

    nextStep() {
      if (this.validateCurrentStep() && this.currentStep < this.steps.length - 1) {
        this.currentStep++
      }
    },

    prevStep() {
      if (this.currentStep > 0) {
        this.currentStep--
      }
    },

    handleStepAction() {
      if (this.isLastStep) {
        this.register()
      } else {
        this.nextStep()
      }
    },

    async register() {
      try {
        this.errorMessage = ''

        // Validation complète du formulaire
        if (!this.validateForm()) {
          return
        }

        this.isLoading = true

        // Création d'une instance du service d'inscription
        const registerService = new RegisterService(
          this.formData.first_name,
          this.formData.last_name,
          this.formData.email,
          this.formData.country,
          this.formData.currency,
          this.formData.phone_number || null,
          this.formData.password,
          this.formData.confirm_password,
        )

        // Soumission de l'inscription
        const result = await registerService.save()

        if (result === 'Erreur') {
          this.errorMessage = "Une erreur est survenue lors de l'inscription. Veuillez réessayer."
          return
        }

        // Redirection vers la page de connexion ou dashboard
        this.$router.push('/auth/login')
      } catch (error: unknown) {
        this.errorMessage =
          error instanceof Error ? error.message : "Une erreur inattendue s'est produite"
      } finally {
        this.isLoading = false
      }
    },
  },
})
</script>

<style scoped>
.icon-svg {
  width: 16px !important;
}
</style>
