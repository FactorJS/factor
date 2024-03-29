<script lang="ts" setup>
import { storeItem, useMeta } from '@factor/api'
import { computed, onMounted, ref } from 'vue'
import ElButton from '@factor/ui/ElButton.vue'

// Images
import bothWaysArrow from './img/both-ways-arrow.svg'

const metaTitle = 'Affiliate Referral Program - Kaption.co'

const metaDescription
  = 'As a Kaption affiliate, you will make a 30% recurring commission for every customer you send our way. Anyone can join.'

useMeta({
  title: metaTitle,
  meta: [
    {
      name: 'description',
      content: metaDescription,
    },
    {
      property: 'og:title',
      content: metaTitle,
    },
    {
      property: 'og:description',
      content: metaDescription,
    },
    {
      name: 'twitter:title',
      content: metaTitle,
    },
    {
      name: 'twitter:description',
      content: metaDescription,
    },
  ],
})

onMounted(() => {
  storeItem('pageMode', 'dark')
})

const volumeTier = ref(0)

const referralAccounts = computed(() => {
  const base = [
    {
      referrals: 1,
    },
    {
      referrals: 2,
    },
    {
      referrals: 4,
    },
    {
      referrals: 8,
    },
    {
      referrals: 16,
    },
    {
      referrals: 32,
    },
    {
      referrals: 64,
    },
    {
      referrals: 125,
    },
    {
      referrals: 250,
    },
    {
      referrals: 500,
    },
    {
      referrals: 1000,
    },
    {
      referrals: 2000,
    },
    {
      referrals: 4000,
    },
  ]

  return base.map((_) => {
    const earnings = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(_.referrals * 23.7)

    const yearlyEarnings = Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(_.referrals * 23.7 * 12)

    const accounts = Intl.NumberFormat('en-US').format(+_.referrals)

    return {
      accounts,
      earnings,
      yearlyEarnings,
    }
  })
})
</script>

<template>
  <div class="overflow-x-hidden">
    <div class="bg-dark-800 sm:pt-16 lg:overflow-hidden lg:pt-8 lg:pb-14">
      <div class="mx-auto max-w-7xl lg:px-8">
        <div class="lg:grid lg:grid-cols-12 lg:gap-8">
          <div
            class="col-span-12 px-6 sm:text-center lg:flex lg:items-center lg:px-0 lg:text-left"
          >
            <div class="pt-32 pb-24 lg:pt-48 lg:pb-32">
              <h1
                class="text-4xl font-extrabold tracking-tight text-white sm:mt-5 sm:text-6xl lg:mt-6 xl:text-7xl"
              >
                <span class="">Help your audience and </span><span
                  class="mt-1 bg-gradient-to-r from-primary-200 to-primary-400 box-decoration-clone bg-clip-text pb-3 text-transparent sm:pb-5 xl:block"
                >earn 30% Recurring Commission</span>
              </h1>
              <div
                class="my-8 max-w-prose space-y-4 text-lg leading-relaxed text-white md:text-2xl"
              >
                <div class="block">
                  It's the holy grail of affiliate marketing: a great product,
                  that helps people, that also pays a great commission on
                  referrals.
                </div>
                <div class="block">
                  As a Kaption affiliate, you will make a 30%
                  <span class="italic">recurring</span> commission for every pro
                  customer you send our way. This is one of the best ways for
                  you to earn passive income.
                </div>
              </div>
              <div class="mt-10 sm:mt-12">
                <div class="">
                  <div class="mt-3 sm:mt-0">
                    <ElButton
                      href="https://app.linkmink.com/a/kaption-co/904"
                      size="lg"
                      btn="whiteOutline"
                      class="px-3 sm:px-6"
                    >
                      Join The Program &rarr;
                    </ElButton>
                  </div>
                  <div
                    class="text-dark-400 mt-8 text-xs uppercase tracking-wider"
                  >
                    Getting started is easy and free.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mx-auto max-w-7xl px-4 py-12 md:px-20 lg:px-8 lg:py-24">
      <div class="my-20 items-center lg:flex-row">
        <h2
          class="max-w-4xl text-3xl font-extrabold tracking-tight lg:pr-7 lg:text-6xl"
        >
          <span
            class="mb-2 block bg-gradient-to-r from-primary-200 to-primary-400 box-decoration-clone bg-clip-text text-transparent"
          >Get Started</span>
          Sign Up for the Program
        </h2>
        <div class="mt-8 text-lg text-white md:text-2xl md:leading-relaxed">
          <div class="grid grid-cols-12 2xl:gap-32">
            <div class="col-span-12 2xl:col-span-6">
              <div>
                Anyone can join Kaption's affiliate program.You don’t even need
                to be a Kaption customer to promote Kaption. However, to be a
                successful affiliate, you should:
              </div>

              <ul class="my-6 ml-12 list-outside list-disc space-y-4">
                <li>
                  Understand the importance of good data in growing traffic and
                  optimizing for sales. You also should sincerely believe in the
                  power of Kaption and in its ability to help people be
                  successful.
                </li>

                <li>
                  Have an audience of people who needs an advanced tool for
                  managing their customer analytics and data.
                </li>
              </ul>
            </div>
            <div class="col-span-12 mt-8 2xl:col-span-6 2xl:mt-2">
              <blockquote
                class="bg-dark-800 rounded-lg shadow-lg sm:max-w-2xl 2xl:absolute"
              >
                <div class="rounded-t-lg px-6 py-8 sm:px-10 sm:pt-10 sm:pb-8">
                  <svg
                    class="svg text-dark-300 w-32"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 412 166"
                  >
                    <g fill="none" fill-rule="evenodd">
                      <path
                        class="svg-text"
                        fill-rule="nonzero"
                        d="M201.79 109.56c6.49 0 10.58-3.37 13.58-7.45v6.61h9.01V53.91h-9.01v21.27c-2.88-3.73-6.97-6.97-13.58-6.97-9.37 0-18.39 7.45-18.39 20.55V89c0 13.11 9.14 20.56 18.39 20.56zm2.17-7.93c-6.13 0-11.42-5.05-11.42-12.62v-.24c0-7.81 5.29-12.62 11.42-12.62s11.54 4.93 11.54 12.62v.24c-.01 7.57-5.41 12.62-11.54 12.62zm31.61-38.7h9.74v-8.65h-9.74v8.65zm.36 45.79h9.13V69.06h-9.13v39.66zm38.34 12.14c7.09 0 12.62-1.68 16.23-5.29 3.37-3.37 5.05-8.29 5.05-15.02V69.06h-9.01v5.89c-3.12-3.61-7.33-6.73-13.94-6.73-9.25 0-18.03 6.85-18.03 18.63v.12c0 11.66 8.65 18.63 18.03 18.63 6.49 0 10.7-3 13.94-7.33v3.12c0 7.93-4.45 12.14-12.5 12.14-5.41 0-9.98-1.56-14.18-4.21l-3.37 6.85c5.16 3.01 11.17 4.69 17.78 4.69zm.72-22.96c-6.25 0-11.3-4.45-11.3-10.94v-.24c0-6.49 4.93-10.82 11.3-10.82 6.25 0 11.66 4.45 11.66 10.94v.12c0 6.38-5.41 10.94-11.66 10.94zm31.73-34.97h9.74v-8.65h-9.74v8.65zm.36 45.79h9.13V69.06h-9.13v39.66zm33.89.72c3.37 0 5.89-.84 8.17-2.04v-7.45c-1.8.84-3.61 1.32-5.65 1.32-3 0-4.81-1.44-4.81-4.93V76.87h10.58v-7.81h-10.58V58.12h-9.13v10.94h-5.05v7.81h5.05v20.91c0 8.66 4.69 11.66 11.42 11.66zm50.48-.72V85.16c0-10.58-5.77-16.71-17.43-16.71-6.49 0-10.82 1.32-15.14 3.25l2.52 7.33c3.61-1.56 6.85-2.52 11.3-2.52 6.25 0 9.74 3 9.74 8.53v.72c-3-.96-6.13-1.56-10.94-1.56-9.25 0-16.11 4.21-16.11 12.98v.12c0 7.93 6.61 12.26 14.18 12.26 6.01 0 10.1-2.52 12.86-5.77v4.93h9.02zm-8.77-14.3c0 4.93-4.57 8.29-10.58 8.29-4.33 0-7.69-2.16-7.69-5.89v-.12c0-3.85 3.37-6.13 9.13-6.13 3.49 0 6.73.6 9.13 1.56v2.29h.01zm19.71 14.3h9.13V53.91h-9.13v54.81z"
                      />
                      <path
                        fill="currentColor"
                        d="M.48.79H164.9v164.42H.48V.79zm31.37 108.53h9.13V71.94l28.97 37.38h7.69V56.68h-9.01V93.1L40.39 56.68h-8.53v52.64h-.01zm61.05 0h9.25V92.37h10.46c11.54 0 21.03-6.13 21.03-17.91v-.12c0-10.58-7.81-17.67-20.07-17.67H92.9v52.65zm9.26-25.24V65.21h10.7c6.97 0 11.3 3.12 11.3 9.37v.12c0 5.53-4.33 9.37-11.3 9.37h-10.7v.01zM9.61 9.93h146.27V156.2H9.61V9.93z"
                      />
                    </g>
                    <title>NP Digital Logo</title>
                  </svg>
                  <div class="relative mt-8 text-2xl font-medium">
                    <p class="relative">
                      Affiliate marketing is an excellent opportunity if you
                      truly believe in the product you're selling. Because many
                      times, you can make money from product you'd recommend
                      anyway.
                    </p>
                  </div>
                </div>
                <cite
                  class="bg-dark-600 relative flex items-center rounded-b-lg py-5 px-6 not-italic sm:mt-10 sm:items-start sm:py-5 sm:pl-12 sm:pr-10"
                >
                  <div
                    class="relative rounded-full border-2 border-white sm:absolute sm:top-0 sm:-translate-y-1/2"
                  >
                    <img
                      class="h-12 w-12 rounded-full bg-indigo-300 sm:h-20 sm:w-20"
                      src="./img/affiliateNeilPatel.webp"
                      alt="Neil Patel Quote"
                    >
                  </div>
                  <span
                    class="text-dark-300 relative ml-4 text-base font-semibold leading-6 sm:ml-24 sm:pl-1"
                  >
                    <p class="mr-2 font-semibold text-white sm:inline">
                      Neil Patel
                    </p>
                    <p class="sm:inline">CEO Neil Patel Digital</p>
                  </span>
                </cite>
              </blockquote>
            </div>
          </div>
        </div>
      </div>

      <div class="my-32 items-center lg:flex-row">
        <h2
          class="max-w-4xl text-3xl font-extrabold tracking-tight lg:pr-7 lg:text-6xl"
        >
          <span
            class="mb-2 block bg-gradient-to-r from-primary-200 to-primary-400 box-decoration-clone bg-clip-text text-transparent"
          >Get Creative</span>
          Share, Discuss, and Promote
        </h2>
        <div class="mt-8 text-lg text-white md:text-2xl md:leading-relaxed">
          <div class="grid grid-cols-12 xl:gap-32">
            <div class="col-span-12 2xl:col-span-6">
              <div class="space-y-4">
                <p>
                  Once you've signed up, you should have your own custom link
                  for referring customers.
                </p>
                <p>
                  To lock in that recurring commission, you just need to start
                  sharing the the link in all the right places. We'll track
                  everything and assign commision accordingly.
                </p>

                <p>
                  As we really want you to be successful, we'll be providing you
                  all sorts of custom resources:
                </p>
              </div>

              <ul class="my-6 ml-12 list-outside list-disc space-y-4">
                <li>Customized ads and graphics</li>

                <li>Custom videos and screencasts for your audience</li>

                <li>Additional resources, features and media on request</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="my-20 items-center lg:flex-row">
        <h2
          class="max-w-4xl text-3xl font-extrabold tracking-tight lg:pr-7 lg:text-6xl"
        >
          <span
            class="mb-2 block bg-gradient-to-r from-primary-200 to-primary-400 box-decoration-clone bg-clip-text text-transparent"
          >Get Paid</span>
          Earn 30% Recurring Income
        </h2>
        <div class="mt-8 text-lg text-white md:text-2xl md:leading-relaxed">
          <div class="grid grid-cols-12 2xl:gap-32">
            <div class="col-span-12 2xl:col-span-6">
              <div>
                Anyone can join Kaption's affiliate program. Seriously, you
                don’t even need to be a Kaption customer to promote Kaption.
                However, to be a successful affiliate, you should:
              </div>

              <ul class="my-6 ml-12 list-outside list-disc space-y-4">
                <li>
                  Understand the importance of good data in growing traffic and
                  optimizing for sales. You also should sincerely believe in the
                  power of Kaption and in its ability to help people be
                  successful.
                </li>

                <li>
                  Have an audience of people who needs an advanced tool for
                  managing their customer analytics and data.
                </li>
              </ul>
            </div>
            <div class="col-span-12 mt-8 2xl:col-span-6 2xl:mt-2">
              <div
                class="bg-dark-800 rounded-lg p-8 text-center shadow-lg sm:p-12"
              >
                <h2
                  class="m-auto text-2xl font-extrabold tracking-tight lg:text-3xl"
                >
                  Refer
                  <span class="mx-2">{{
                    referralAccounts[volumeTier].accounts
                  }}</span>
                  <span v-if="volumeTier > 0"> accounts </span>
                  <span v-else> account </span> to our starting plan.
                  <!-- for up to 10,000 sessions -->
                </h2>
                <div class="mb-4 flex flex-col items-center">
                  <div class="my-12">
                    <div
                      class="mb-4 text-3xl font-extrabold lg:text-7xl"
                      v-html="referralAccounts[volumeTier].yearlyEarnings"
                    />

                    <div class="text-dark-200 text-lg font-medium uppercase">
                      Per Year /
                      <div
                        class="inline"
                        v-html="referralAccounts[volumeTier].earnings"
                      />
                      a month
                    </div>
                  </div>

                  <input
                    v-model="volumeTier"
                    type="range"
                    name="volume"
                    min="0"
                    :max="referralAccounts.length - 1"
                    class="mt-4 mb-8 h-2 w-full max-w-lg bg-purple-100 outline-none"
                  >
                  <img
                    :src="bothWaysArrow"
                    alt="both ways arrow"
                    class="mb-2.5 self-center"
                  >
                  <div class="self-center">
                    Adjust To Calculate
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="my-20 items-center lg:flex-row">
        <h2
          class="max-w-4xl text-3xl font-extrabold tracking-tight lg:pr-7 lg:text-6xl"
        >
          <span
            class="mb-2 block bg-gradient-to-r from-primary-200 to-primary-400 box-decoration-clone bg-clip-text text-transparent"
          >Now's the time</span>
          There's never been a better time to get started than today.
        </h2>
        <div class="mt-8 text-lg text-white md:text-2xl md:leading-relaxed">
          <div class="grid grid-cols-12">
            <div class="col-span-12">
              <div>
                Through this program you’ll have the opportunity to not only
                earn extra money for you and your family, but you’ll also be
                helping your audience do the same.
              </div>
            </div>
            <div class="col-span-12 mt-8">
              <ElButton
                href="https://app.linkmink.com/a/kaption-co/904"
                size="lg"
                btn="whiteOutline"
                class="px-3 sm:px-6"
              >
                Join The Program &rarr;
              </ElButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less">
input[type="range"] {
  @apply rounded-sm;
  -moz-appearance: none;
  -webkit-appearance: none;

  &::-webkit-slider-thumb {
    @apply h-9 w-9 bg-white cursor-pointer rounded-full appearance-none;
    -webkit-appearance: none;
    border: 8px solid #8660fe;
  }
  &::-moz-range-thumb {
    @apply h-9 w-9 bg-white cursor-pointer rounded-full appearance-none;
    border: 8px solid #8660fe;
  }
  &::-ms-thumb {
    @apply h-9 w-9 bg-white cursor-pointer rounded-full appearance-none;
    border: 8px solid #8660fe;
  }
  &::-moz-focus-outer {
    border: 0;
  }
}
</style>
