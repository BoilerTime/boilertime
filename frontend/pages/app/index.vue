<template>
  <main
    class="flex flex-col h-screen pb-10 overflow-y-scroll bg-gray-100 dark:bg-neutral-700"
  >
    <Modal
      @closed="closePrivacyPopup()"
      v-if="privacyPopup"
      class="absolute inset-y-1"
    >
      <template #header>
        <div class="flex flex-col justify-start">
          <LockClosedIcon class="h-24 w-24 text-indigo-500"></LockClosedIcon>
          <h1 class="text-3xl font-bold dark:text-gray-200">
            Your <span class="text-yellow-500">Privacy</span>
          </h1>
        </div>
      </template>
      <template #body>
        <h1 class="-mt-6 text-sm font-medium dark:text-gray-200">
          In order to provide the best experience, we use cookies to store your
          preferences and data. We understand that you may not want to be
          tracked, so we have provided you with the option to opt out of certain
          cookies. However, this may result in a degraded experience.
        </h1>
        <div class="flex flex-row gap-4 justify-center mt-6 -mb-6">
          <button
            @click="submitAllCookies"
            class="text-center w-full bg-indigo-500 hover:bg-indigo-700 p-3 text-white rounded-lg font-bold"
          >
            Accept all cookies
          </button>
          <button
            @click="submitNecssaryCookies"
            class="text-center w-full bg-indigo-200 p-3 text-indigo-600 rounded-lg font-bold hover:bg-indigo-700 hover:text-white"
          >
            Necessary cookies only
          </button>
        </div>
      </template>
      <template #footer class="hidden"> </template>
    </Modal>
    <body>
      <div v-if="isMobile">
        <NavBarMobile />
      </div>
      <div v-else>
        <NavBar />
      </div>
      <div class="px-4 mx-auto max-w-7xl md:px-8">
        <div class="block py-5">
          <div class="items-center flex gap-8">
            <div>
              <p class="text-2xl font-semibold text-black dark:text-white">
                Welcome, {{ firstname }}
              </p>
            </div>
          </div>
        </div>
        <section class="flex flex-row gap-10">
          <div class="bg-white dark:bg-neutral-500 shadow-lg rounded-lg">
            <div v-if="userSchedules.length !== 0">
              <!-- Data items -->
              <div class="flex flex-row justify-center gap-10 p-10">
                <!-- Add button -->
                <button
                  class="p-6 flex justify-center items-center w-64 text-indigo-500 bg-white border-2 border-indigo-500 border-dashed rounded-lg h-72 dark:bg-neutral-700 hover:text-indigo-700 hover:bg-gray-100"
                  @click="navigateToCreateSchedule()"
                >
                  <PlusIcon class="w-12 h-12" />
                </button>
              </div>
            </div>
            <div v-else>
              <div
                class="flex items-start justify-start h-screen dark:bg-neutral-500"
              >
                <div
                  class="flex px-8 py-6 border border-black rounded-lg shadow-lg bg-white-500"
                  @click="navigateToCreateSchedule()"
                >
                  <Bars3Icon
                    class="w-8 h-8 text-black-400 dark:text-gray-200"
                  />
                  <span class="ml-4 text-lg text-black-400 dark:text-gray-200"
                    >Create a new schedule</span
                  >
                </div>
              </div>
            </div>
          </div>
          <div>
            <div v-if="!isMobile" class="mb-4">
              <!--Start Search Bar-->
              <div class="w-full max-w-md">
                <div class="flex">
                  <div class="relative z-10">
                    <input
                      v-model="searchTerm"
                      class="w-64 px-3 py-2 border border-gray-400 rounded-l-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                      type="text"
                      placeholder="Search"
                      @keyup.enter="addSingleResultToSelected"
                    />
                    <ul
                      v-if="isSearchActive && filteredResults.length > 0"
                      class="absolute z-10 w-full mt-1 overflow-scroll bg-white shadow-lg rounded-md max-h-48"
                    >
                      <li
                        v-for="result in filteredResults"
                        :key="result"
                        class="px-4 py-2 cursor-pointer hover:bg-blue-500 hover:text-white"
                        @click="navigate(result, searchType)"
                      >
                        <span>{{ result }}</span>
                      </li>
                    </ul>
                  </div>
                  <div class="relative">
                    <select
                      class="h-full px-3 py-2 bg-white border border-gray-400 appearance-none pr-9 rounded-r-md"
                      v-model="searchType"
                    >
                      <option>Professor</option>
                      <option>Classroom</option>
                      <option>Course</option>
                      <option>TA</option>
                    </select>
                    <div
                      class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none"
                    >
                      <svg
                        class="w-4 h-4 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          d="M10 12a.997.997 0 0 1-.707-.293l-4-4a.999.999 0 1 1 1.414-1.414L10 9.586l3.293-3.293a.999.999 0 1 1 1.414 1.414l-4 4A.997.997 0 0 1 10 12z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="!isMobile">
              <!--Hub content -->
              <div class="grid grid-cols-1 gap-4">
                <section aria-labelledby="section-2-title">
                  <div
                    class="overflow-scroll bg-white shadow-xl rounded-xl h-96"
                  >
                    <div class="p-6">
                      <div v-if="resultData && isDataLoaded">
                        <h1 class="mb-6 text-xl font-semibold text-left">
                          {{ result }}
                        </h1>
                        <div class="" v-if="resultType == 'Professor'">
                          <div class="" v-if="resultData.length == 2">
                            <div class="mb-6">
                              <div
                                class="flex justify-between mb-1"
                                v-if="advanced_result['email']"
                              >
                                <span
                                  class="text-base font-medium text-blue-700"
                                  >Email</span
                                >
                                <a
                                  :href="'mailto:' + advanced_result['email']"
                                  class="text-base font-medium text-blue-700 hover:text-blue-300"
                                  >{{ advanced_result["email"] }}</a
                                >
                              </div>
                              <div
                                class="flex justify-between mb-1"
                                v-if="advanced_result['title']"
                              >
                                <span
                                  class="text-base font-medium text-blue-700"
                                  >Title</span
                                >
                                <span
                                  class="text-base font-medium text-blue-700"
                                  >{{ advanced_result["title"] }}</span
                                >
                              </div>
                              <div
                                class="flex justify-between mb-1"
                                v-if="advanced_result['office phone']"
                              >
                                <span
                                  class="text-base font-medium text-blue-700"
                                  >Phone</span
                                >
                                <a
                                  :href="
                                    'tel:' + advanced_result['office phone']
                                  "
                                  class="text-base font-medium text-blue-700 hover:text-blue-300"
                                  >{{ advanced_result["office phone"] }}</a
                                >
                              </div>
                            </div>
                            <div class="flex justify-between mb-1">
                              <span class="text-base font-medium text-blue-700"
                                >Department</span
                              >
                              <span
                                class="text-base font-medium text-blue-700"
                                v-if="resultData[1]"
                                >{{ resultData[1].department }}</span
                              >
                            </div>
                            <div class="flex justify-between mb-4">
                              <span class="text-base font-medium text-blue-700"
                                >Averaged from</span
                              >
                              <span
                                class="text-base font-medium text-blue-700"
                                v-if="resultData[1]"
                                >{{ resultData[1].numRatings }} ratings</span
                              >
                            </div>
                            <div class="flex justify-between mb-1">
                              <span class="text-base font-medium text-blue-700"
                                >Average GPA</span
                              >
                              <span
                                class="text-sm font-medium text-blue-700"
                                v-if="resultData[0]"
                                >{{ resultData[0].overall_gpa }}</span
                              >
                            </div>
                            <div
                              class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-3"
                              v-if="resultData[0]"
                            >
                              <div
                                class="bg-blue-600 h-2.5 rounded-full"
                                :style="{
                                  width: resultData[0].percentage * 100 + '%',
                                }"
                              ></div>
                            </div>
                            <div v-else>No data available</div>
                            <div class="flex justify-between mb-1">
                              <span class="text-base font-medium text-blue-700"
                                >Average difficulty</span
                              >
                              <span
                                class="text-sm font-medium text-blue-700"
                                v-if="
                                  resultData[1] &&
                                  resultData[1].avgDifficulty > 0
                                "
                                >{{
                                  (
                                    (resultData[1].avgDifficulty / 5.0) *
                                    100
                                  ).toPrecision(4) + "%"
                                }}</span
                              >
                            </div>
                            <div
                              class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-3"
                              v-if="
                                resultData[1] && resultData[1].avgDifficulty > 0
                              "
                            >
                              <div
                                class="bg-blue-600 h-2.5 rounded-full"
                                :style="{
                                  width:
                                    (resultData[1].avgDifficulty / 5.0) * 100 +
                                    '%',
                                }"
                              ></div>
                            </div>
                            <div v-else>No data available</div>
                            <div class="flex justify-between mb-1">
                              <span class="text-base font-medium text-blue-700"
                                >Average rating</span
                              >
                              <span
                                class="text-sm font-medium text-blue-700"
                                v-if="
                                  resultData[1] && resultData[1].avgRating > 0
                                "
                                >{{
                                  (
                                    (resultData[1].avgRating / 5.0) *
                                    100
                                  ).toPrecision(4) + "%"
                                }}</span
                              >
                            </div>
                            <div
                              class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-3"
                              v-if="
                                resultData[1] && resultData[1].avgRating > 0
                              "
                            >
                              <div
                                class="bg-blue-600 h-2.5 rounded-full"
                                :style="{
                                  width:
                                    (resultData[1].avgRating / 5.0) * 100 + '%',
                                }"
                              ></div>
                            </div>
                            <div v-else>No data available</div>
                            <div class="flex justify-between mb-1">
                              <span class="text-base font-medium text-blue-700"
                                >Would take again</span
                              >
                              <span
                                class="text-sm font-medium text-blue-700"
                                v-if="
                                  resultData[1] &&
                                  resultData[1].wouldTakeAgainPercent >= 0
                                "
                                >{{
                                  resultData[1].wouldTakeAgainPercent.toPrecision(
                                    4
                                  ) + "%"
                                }}</span
                              >
                            </div>
                            <div
                              class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700"
                              v-if="
                                resultData[1] &&
                                resultData[1].wouldTakeAgainPercent >= 0
                              "
                            >
                              <div
                                class="bg-blue-600 h-2.5 rounded-full"
                                :style="{
                                  width:
                                    resultData[1].wouldTakeAgainPercent + '%',
                                }"
                              ></div>
                            </div>
                            <div v-else>No data available</div>
                            <div class="mt-8 mb-4">
                              <iframe
                                width="335"
                                height="250"
                                style="border: 0"
                                loading="lazy"
                                scrolling="no"
                                gestureHandling="none"
                                referrerpolicy="no-referrer-when-downgrade"
                                :src="
                                  'https://www.google.com/maps/embed/v1/place?key=AIzaSyDZSvQc9nGqbNtJ66CTu1IGrBl-9RHllIU&q=' +
                                  advanced_result['building'] +
                                  ' Purdue+University,West+Lafayette+IN'
                                "
                              >
                              </iframe>
                            </div>
                            <div
                              class="mb-3 flex-wrap text-center items-center"
                              v-if="advanced_result['building']"
                            >
                              <span class="text-base font-medium text-blue-700"
                                >Office<br
                              /></span>
                              <span
                                class="text-base font-medium text-blue-700"
                                >{{ advanced_result["building"] }}</span
                              >
                            </div>
                            <div
                              class="mb-2 flex-wrap text-center items-center"
                              v-if="advanced_result['url']"
                            >
                              <span class="text-base font-medium text-blue-700"
                                >Website<br
                              /></span>
                              <a
                                :href="advanced_result['url']"
                                class="text-base font-medium text-blue-700 hover:text-blue-300"
                                >{{ advanced_result["url"] }}</a
                              >
                            </div>
                          </div>
                          <div class="" v-else-if="resultData.length == 1">
                            <div class="mb-6">
                              <div
                                class="flex justify-between mb-1"
                                v-if="advanced_result['email']"
                              >
                                <span
                                  class="text-base font-medium text-blue-700"
                                  >Email</span
                                >
                                <a
                                  :href="'mailto:' + advanced_result['email']"
                                  class="text-base font-medium text-blue-700 hover:text-blue-300"
                                  >{{ advanced_result["email"] }}</a
                                >
                              </div>
                              <div
                                class="flex justify-between mb-1"
                                v-if="advanced_result['title']"
                              >
                                <span
                                  class="text-base font-medium text-blue-700"
                                  >Title</span
                                >
                                <span
                                  class="text-base font-medium text-blue-700"
                                  >{{ advanced_result["title"] }}</span
                                >
                              </div>
                              <div
                                class="flex justify-between mb-1"
                                v-if="advanced_result['office phone']"
                              >
                                <span
                                  class="text-base font-medium text-blue-700"
                                  >Phone</span
                                >
                                <a
                                  :href="
                                    'tel:' + advanced_result['office phone']
                                  "
                                  class="text-base font-medium text-blue-700 hover:text-blue-300"
                                  >{{ advanced_result["office phone"] }}</a
                                >
                              </div>
                            </div>
                            <div
                              class="flex justify-between mb-1"
                              v-if="resultData[0].overall_gpa"
                            >
                              <span class="text-base font-medium text-blue-700"
                                >Average GPA</span
                              >
                              <span
                                class="text-sm font-medium text-blue-700"
                                v-if="resultData[0]"
                                >{{ resultData[0].overall_gpa }}</span
                              >
                            </div>
                            <div
                              class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-3"
                              v-if="resultData[0].overall_gpa"
                            >
                              <div
                                class="bg-blue-600 h-2.5 rounded-full"
                                :style="{
                                  width: resultData[0].percentage * 100 + '%',
                                }"
                              ></div>
                            </div>
                            <div v-else>No data available</div>
                            <div
                              class="flex justify-between mb-1"
                              v-if="resultData[0].department"
                            >
                              <span class="text-base font-medium text-blue-700"
                                >Department</span
                              >
                              <span
                                class="text-base font-medium text-blue-700"
                                >{{ resultData[0].department }}</span
                              >
                            </div>
                            <div
                              class="flex justify-between mb-4"
                              v-if="resultData[0].numRatings"
                            >
                              <span class="text-base font-medium text-blue-700"
                                >Averaged from</span
                              >
                              <span class="text-base font-medium text-blue-700"
                                >{{ resultData[0].numRatings }} ratings</span
                              >
                            </div>
                            <div class="flex justify-between mb-1">
                              <span class="text-base font-medium text-blue-700"
                                >Average difficulty</span
                              >
                              <span
                                class="text-sm font-medium text-blue-700"
                                v-if="
                                  resultData[0] &&
                                  resultData[0].avgDifficulty > 0
                                "
                                >{{
                                  (
                                    (resultData[0].avgDifficulty / 5.0) *
                                    100
                                  ).toPrecision(4) + "%"
                                }}</span
                              >
                            </div>
                            <div
                              class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-3"
                              v-if="
                                resultData[0] && resultData[0].avgDifficulty > 0
                              "
                            >
                              <div
                                class="bg-blue-600 h-2.5 rounded-full"
                                :style="{
                                  width:
                                    (resultData[0].avgDifficulty / 5.0) * 100 +
                                    '%',
                                }"
                              ></div>
                            </div>
                            <div v-else>No data available</div>
                            <div class="flex justify-between mb-1">
                              <span class="text-base font-medium text-blue-700"
                                >Average rating</span
                              >
                              <span
                                class="text-sm font-medium text-blue-700"
                                v-if="
                                  resultData[0] && resultData[0].avgRating > 0
                                "
                                >{{
                                  (
                                    (resultData[0].avgRating / 5.0) *
                                    100
                                  ).toPrecision(4) + "%"
                                }}</span
                              >
                            </div>
                            <div
                              class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-3"
                              v-if="
                                resultData[0] && resultData[0].avgRating > 0
                              "
                            >
                              <div
                                class="bg-blue-600 h-2.5 rounded-full"
                                :style="{
                                  width:
                                    (resultData[0].avgRating / 5.0) * 100 + '%',
                                }"
                              ></div>
                            </div>
                            <div v-else>No data available</div>
                            <div class="flex justify-between mb-1">
                              <span class="text-base font-medium text-blue-700"
                                >Would take again</span
                              >
                              <span
                                class="text-sm font-medium text-blue-700"
                                v-if="
                                  resultData[0] &&
                                  resultData[0].wouldTakeAgainPercent >= 0
                                "
                                >{{
                                  resultData[0].wouldTakeAgainPercent.toPrecision(
                                    4
                                  ) + "%"
                                }}</span
                              >
                            </div>
                            <div
                              class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700"
                              v-if="
                                resultData[0] &&
                                resultData[0].wouldTakeAgainPercent >= 0
                              "
                            >
                              <div
                                class="bg-blue-600 h-2.5 rounded-full"
                                :style="{
                                  width:
                                    resultData[0].wouldTakeAgainPercent + '%',
                                }"
                              ></div>
                            </div>
                            <div v-else>No data available</div>
                            <div class="mt-8 mb-4">
                              <iframe
                                width="335"
                                height="250"
                                style="border: 0"
                                loading="lazy"
                                scrolling="no"
                                gestureHandling="none"
                                referrerpolicy="no-referrer-when-downgrade"
                                :src="
                                  'https://www.google.com/maps/embed/v1/place?key=AIzaSyDZSvQc9nGqbNtJ66CTu1IGrBl-9RHllIU&q=' +
                                  advanced_result['building'] +
                                  ' Purdue+University,West+Lafayette+IN'
                                "
                              >
                              </iframe>
                            </div>
                            <div
                              class="mb-3 flex-wrap text-center items-center"
                              v-if="advanced_result['building']"
                            >
                              <span class="text-base font-medium text-blue-700"
                                >Office<br
                              /></span>
                              <span
                                class="text-base font-medium text-blue-700"
                                >{{ advanced_result["building"] }}</span
                              >
                            </div>
                            <div
                              class="mb-2 flex-wrap text-center items-center"
                              v-if="advanced_result['url']"
                            >
                              <span class="text-base font-medium text-blue-700"
                                >Website<br
                              /></span>
                              <a
                                :href="advanced_result['url']"
                                class="text-base font-medium text-blue-700 hover:text-blue-300"
                                >{{ advanced_result["url"] }}</a
                              >
                            </div>
                          </div>
                          <div v-else>No data available</div>
                          <div class="flex justify-between mb-1"></div>
                        </div>
                        <div
                          class="flex flex-col items-center mb-12"
                          v-if="resultType == 'Classroom'"
                        >
                          <div class="w-full max-w-md">
                            <iframe
                              width="320"
                              height="250"
                              style="border: 0"
                              loading="lazy"
                              scrolling="no"
                              gestureHandling="none"
                              referrerpolicy="no-referrer-when-downgrade"
                              :src="
                                'https://www.google.com/maps/embed/v1/place?key=AIzaSyDZSvQc9nGqbNtJ66CTu1IGrBl-9RHllIU&q=' +
                                actual_name +
                                'Purdue+University,West+Lafayette+IN'
                              "
                            >
                            </iframe>
                            <h2 class="mt-8 mb-4 text-2xl font-bold">
                              Ratings
                            </h2>
                            <div
                              v-for="(group, index) in resultData"
                              :key="index"
                            >
                              <div
                                v-for="(rating, ratingIndex) in group"
                                :key="ratingIndex"
                                class="p-4 mb-4 bg-gray-300 rounded-lg shadow-xl"
                              >
                                <div class="flex items-center mb-2">
                                  <span class="mr-2 font-bold text-gray-700"
                                    >Timestamp:</span
                                  >
                                  <span class="text-gray-600">{{
                                    rating.timestamp
                                  }}</span>
                                </div>
                                <div class="flex items-center mb-2">
                                  <span class="mr-2 font-bold text-gray-700"
                                    >Convenience of access:</span
                                  >
                                  <span class="text-gray-600">{{
                                    rating.rating[0]
                                  }}</span>
                                </div>
                                <div class="flex items-center mb-2">
                                  <span class="mr-2 font-bold text-gray-700"
                                    >Quality of seating:
                                  </span>
                                  <span class="text-gray-600">{{
                                    rating.rating[1]
                                  }}</span>
                                </div>
                                <div class="flex items-center mb-2">
                                  <span class="mr-2 font-bold text-gray-700"
                                    >Availability of technology:</span
                                  >
                                  <span class="text-gray-600">{{
                                    rating.rating[2]
                                  }}</span>
                                </div>
                                <div class="flex items-center mb-2">
                                  <span class="mr-2 font-bold text-gray-700"
                                    >Explanation:</span
                                  >
                                  <span class="text-gray-600">{{
                                    rating.explanation
                                  }}</span>
                                </div>
                                <div
                                  class="flex items-center"
                                  v-if="rating.flag_count >= 3"
                                >
                                  <span class="mr-2 font-bold text-red-500"
                                    >Rating was flagged</span
                                  >
                                  <span class="text-red-500"
                                    >{{ rating.flag_count }} times</span
                                  >
                                </div>
                                <button
                                  v-if="rating.user_id != userStore.user_id"
                                  class="p-1 mt-3 text-sm font-bold text-white bg-red-500 rounded"
                                  @click="flag(rating.user_id, 'classroom')"
                                >
                                  Flag
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          class="flex flex-col items-center py-6 mb-12"
                          v-if="resultType === 'Course'"
                        >
                          <div class="w-full max-w-md">
                            <h2 class="mb-4 text-2xl font-bold">Ratings</h2>
                            <div
                              v-for="(group, index) in resultData"
                              :key="index"
                            >
                              <div
                                v-for="(rating, ratingIndex) in group"
                                :key="ratingIndex"
                                class="p-4 mb-4 bg-gray-300 rounded-lg shadow-xl"
                              >
                                <div class="flex items-center mb-2">
                                  <span class="mr-2 font-bold text-gray-700"
                                    >Timestamp:</span
                                  >
                                  <span class="text-gray-600">{{
                                    rating.timestamp
                                  }}</span>
                                </div>
                                <div class="flex items-center mb-2">
                                  <span class="mr-2 font-bold text-gray-700"
                                    >Strictness of prerequisite
                                    requirements:</span
                                  >
                                  <span class="text-gray-600">{{
                                    rating.rating[0]
                                  }}</span>
                                </div>
                                <div class="flex items-center mb-2">
                                  <span class="mr-2 font-bold text-gray-700"
                                    >Pace of material covered:</span
                                  >
                                  <span class="text-gray-600">{{
                                    rating.rating[1]
                                  }}</span>
                                </div>
                                <div class="flex items-center mb-2">
                                  <span class="mr-2 font-bold text-gray-700"
                                    >Depth of material covered:</span
                                  >
                                  <span class="text-gray-600">{{
                                    rating.rating[2]
                                  }}</span>
                                </div>
                                <div class="flex items-center mb-2">
                                  <span class="mr-2 font-bold text-gray-700"
                                    >Explanation:</span
                                  >
                                  <span class="text-gray-600">{{
                                    rating.explanation
                                  }}</span>
                                </div>
                                <div
                                  class="flex items-center"
                                  v-if="rating.flag_count >= 3"
                                >
                                  <span class="mr-2 font-bold text-red-500"
                                    >Rating was flagged</span
                                  >
                                  <span class="text-red-500"
                                    >{{ rating.flag_count }} times</span
                                  >
                                </div>
                                <button
                                  v-if="rating.user_id != userStore.user_id"
                                  class="p-1 mt-3 text-sm font-bold text-white bg-red-500 rounded"
                                  @click="flag(rating.user_id, 'course')"
                                >
                                  Flag
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          class="flex flex-col items-center py-6 mb-12"
                          v-if="resultType === 'TA'"
                        >
                          <div class="w-full max-w-md">
                            <div class="flex justify-between mb-1">
                              <span class="text-base font-medium text-blue-700"
                                >Involved with</span
                              >
                              <div class="flex items-center">
                                <ul>
                                  <li
                                    v-for="(course, index) in actual_course"
                                    :key="index"
                                  >
                                    <p
                                      class="text-base font-medium text-blue-700"
                                    >
                                      {{ course }}
                                    </p>
                                  </li>
                                </ul>
                              </div>
                            </div>
                            <h2 class="mb-4 text-2xl font-bold">Ratings</h2>
                            <div
                              v-for="(group, index) in resultData"
                              :key="index"
                            >
                              <div
                                v-for="(rating, ratingIndex) in group"
                                :key="ratingIndex"
                                class="p-4 mb-4 bg-gray-300 rounded-lg shadow-xl"
                              >
                                <div class="flex items-center mb-2">
                                  <span class="mr-2 font-bold text-gray-700"
                                    >Timestamp:</span
                                  >
                                  <span class="text-gray-600">{{
                                    rating.timestamp
                                  }}</span>
                                </div>
                                <div class="flex items-center mb-2">
                                  <span class="mr-2 font-bold text-gray-700"
                                    >Helpfulness of answering questions:</span
                                  >
                                  <span class="text-gray-600">{{
                                    rating.rating[0]
                                  }}</span>
                                </div>
                                <div class="flex items-center mb-2">
                                  <span class="mr-2 font-bold text-gray-700"
                                    >Responsiveness:</span
                                  >
                                  <span class="text-gray-600">{{
                                    rating.rating[1]
                                  }}</span>
                                </div>
                                <div class="flex items-center mb-2">
                                  <span class="mr-2 font-bold text-gray-700"
                                    >Fairness of grading:</span
                                  >
                                  <span class="text-gray-600">{{
                                    rating.rating[2]
                                  }}</span>
                                </div>
                                <div class="flex items-center mb-2">
                                  <span class="mr-2 font-bold text-gray-700"
                                    >Explanation:</span
                                  >
                                  <span class="text-gray-600">{{
                                    rating.explanation
                                  }}</span>
                                </div>
                                <div
                                  class="flex items-center"
                                  v-if="rating.flag_count >= 3"
                                >
                                  <span class="mr-2 font-bold text-red-500"
                                    >Rating was flagged</span
                                  >
                                  <span class="text-red-500"
                                    >{{ rating.flag_count }} times</span
                                  >
                                </div>
                                <button
                                  v-if="rating.user_id != userStore.user_id"
                                  class="p-1 mt-3 text-sm font-bold text-white bg-red-500 rounded"
                                  @click="flag(rating.user_id, 'ta')"
                                >
                                  Flag
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div v-else>
                        <div
                          class="flex items-start justify-start h-screen dark:bg-neutral-500"
                        ></div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </section>
      </div>
    </body>
  </main>
</template>

<script setup>
import { onUnmounted } from "vue";
import { Bars3Icon, LockClosedIcon } from "@heroicons/vue/24/outline";
import { PlusIcon } from "@heroicons/vue/20/solid";
import { ref } from "vue";
import axios from "axios";
import { onMounted } from "vue";
import { useUserStore } from "../../store/user";
import { useGuestStore } from "../../store/guest";
const { $toast } = useNuxtApp();
const route = useRoute();
const userSchedules = ref([]);
const scheduleData = ref([]);
var numSchedules;
var isMobile = ref(false);
var privacyPopup = ref(false);
var firstname = ref("");
var lastname = ref("");
var privacy = ref();
var pairs = ref();
var gradMonth = ref("");
var email = ref("");
var gradYear = ref();
var isGradStudent = ref(false);

function openPrivacyPopup() {
  if (route.query.verified == "true") {
    privacyPopup.value = true;
  }
}

function closePrivacyPopup() {
  privacyPopup.value = false;
}

async function checkWindowSize() {
  isMobile.value = window.innerWidth <= 768;
}

async function navigateToCreateSchedule() {
  navigateTo("/app/create");
}

async function getScheduleView(term_id) {
  navigateTo("/app/view/" + term_id);
}

function formatTitle(title) {
  return title.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

onBeforeMount(async () => {
  await axios
    .post(
      "https://api.boilerti.me/api/get/user_schedules",
      {
        user_id: userStore.user_id,
      },
      config
    )
    .then((response) => {
      userSchedules.value = response.data;
      numSchedules =
        userSchedules.value[userSchedules.value.length - 1].num_schedules;
      console.log(numSchedules + " this is the num schedules");
      userSchedules.value.pop();
    });
  if (!isAGuest.value) {
    if (numSchedules === 0 && guestStore.schedule) {
      axios
        .post(
          "https://api.boilerti.me/api/saveschedule",
          {
            user_id: userStore.user_id,
            required_classes: guestStore.schedule.required_classes,
            optional_classes: guestStore.schedule.optional_classes,
            time: guestStore.schedule.time,
            rmp: guestStore.schedule.rmp,
            blocked_times: guestStore.schedule.blocked_times,
          },
          config
        )
        .then((response) => {
          if (response.data["accessToken"] != undefined) {
            userStore.user = {
              accessToken: response.data["accessToken"],
              user_id: user_id,
            };
            accessToken = userStore.accessToken;
            config.headers["authorization"] = `Bearer ${accessToken}`;
          }
          $toast.success("Imported Schedule Created As Guest!", {
            timeout: 2000,
          });
        });
      setTimeout(() => {
        window.location.reload();
      }, 2000); // Wait 1 second before showing the toast message
    }
  }
  await checkWindowSize();
});

let interval;

onUnmounted(() => {
  clearInterval(interval);
});

const searchTerm = ref("");

const professors = ref([]);
const professorsadvanced = ref([]);
const classrooms = ref([]);
const courses = ref([]);
const tas = ref([]);
const tas_inv = ref([]);

var lastname = ref("");
var firstname = ref("");

var isSearchActive = ref(true);
var searchType = ref("Professor");

var result = ref("");
var resultType = ref("");
var resultData = ref([]);

var userStore = useUserStore();
var guestStore = useGuestStore();
var isAGuest = ref(true);
var resultSchedule = ref([]);

onMounted(async () => {
  if (userStore.user_id) {
    isAGuest.value = false;
  }
});

var isDataLoaded = ref(false);
var accessToken = userStore.accessToken;
const config = {
  headers: {
    authorization: `Bearer ${accessToken}`,
  },
};

async function flag(id, type) {
  console.log(id, type, result.value);
  try {
    await axios.post(
      "https://api.boilerti.me/api/add/flag",
      {
        user_id: id,
        type: type,
        name: result.value.replace(/ /g, ""),
      },
      config
    );
    alert("Successfully flagged!");
  } catch (error) {
    alert("Failed to flag. Please try again.");
    console.error(error);
  }
}

async function logout() {
  console.log("logout");
  userStore.logOut();
}

async function fetch() {
  try {
    await axios
      .get("https://api.boilerti.me/api/professorsnew")
      .then((response) => {
        professors.value = response.data;
      });
    await axios
      .get("https://api.boilerti.me/api/professorsadvanced")
      .then((response) => {
        professorsadvanced.value = response.data;
      });
    await axios
      .get("https://api.boilerti.me/api/classroomsnew")
      .then((response) => {
        classrooms.value = response.data.classrooms;
      });
    await axios
      .get("https://api.boilerti.me/api/searchnew")
      .then((response) => {
        courses.value = response.data;
      });
    await axios.get("https://api.boilerti.me/api/tasnew").then((response) => {
      tas.value = Object.keys(response.data);
      tas_inv.value = response.data;
    });
  } catch (error) {
    console.error(error);
  }
}


const filteredResults = computed(() => {
  resultData.value = [];
  actual_course.value = [];
  advanced_result.value = [];
  if (!searchTerm.value) {
    return [];
  }
  if (searchType.value == "Professor") {
    return professors.value.filter((item) => {
      resultData.value = [];
      actual_course.value = [];
      return item.toLowerCase().includes(searchTerm.value.toLowerCase());
    });
  } else if (searchType.value == "Classroom") {
    return classrooms.value.filter((item) => {
      resultData.value = [];
      actual_course.value = [];
      advanced_result.value = [];
      return item.toLowerCase().includes(searchTerm.value.toLowerCase());
    });
  } else if (searchType.value == "Course") {
    return courses.value.filter((item) => {
      resultData.value = [];
      actual_course.value = [];
      advanced_result.value = [];
      return item.toLowerCase().includes(searchTerm.value.toLowerCase());
    });
  } else if (searchType.value == "TA") {
    return tas.value.filter((item) => {
      resultData.value = [];
      actual_course.value = [];
      advanced_result.value = [];
      return item.toLowerCase().startsWith(searchTerm.value.toLowerCase());
    });
  }
});

var actual_name = ref("");
var actual_course = ref([]);
var advanced_result = ref([]);

async function navigate(selected, type) {
  resultData.value = [];
  actual_course.value = [];
  advanced_result.value = [];
  searchTerm.value = "";
  result.value = selected;
  resultType.value = type;
  if (type == "Professor") {
    var name = result.value;
    result.value = result.value.split(",");
    result.value = result.value[1].trim() + " " + result.value[0];
    const advanced = professorsadvanced.value.find((obj) => obj.name === name);
    console.log(advanced);
    if (advanced) {
      try {
        var lookup = await axios.get(
          "https://api.boilerti.me/api/buildingsnew"
        );
        lookup = lookup.data;
        var search = advanced["building"].toUpperCase();
        advanced["building"] = lookup[search];
        isDataLoaded.value = true;
        if (isDataLoaded) {
          advanced_result.value = advanced;
          isDataLoaded.value = true;
        }
      } catch {
        advanced_result.value = advanced;
        isDataLoaded.value = true;
      }
    } else {
      advanced_result.value = [];
      isDataLoaded.value = true;
    }
    axios
      .post("https://api.boilerti.me/api/getoverall_gpa", {
        prof_name: result.value,
      })
      .then((response) => {
        console.log(response.data.overall_gpa);
        try {
          var gpa = {
            overall_gpa: response.data.overall_gpa,
            percentage: response.data.overall_gpa / 4.0,
          };
          resultData.value.push(gpa);
          isDataLoaded.value = true;
          axios
            .post("https://api.boilerti.me/api/ratemyprofessor", {
              prof_name: result.value,
            })
            .then((response) => {
              resultData.value.push(response.data);
              isDataLoaded.value = true;
            })
            .catch((error) => {
              console.log(error);
              isDataLoaded.value = true;
            });
        } catch {
          resultData.value.push({ overall_gpa: "N/A", percentage: 0 });
        }
      })
      .catch((error) => {
        console.log(error);
        resultData.value.push({ overall_gpa: "N/A", percentage: 0 });
      });
  }
  if (type == "Classroom") {
    // clasroom_ratings/classrooms
    await axios
      .post("https://api.boilerti.me/api/get/classroom_ratings/classrooms", {
        classroom: result.value.replace(/ /g, ""),
      })
      .then((response) => {
        console.log(response.data);
        var data = response.data;
        resultData.value.push(data);
      });
    var search = result.value.split(" ")[0];
    var lookup = await axios.get("https://api.boilerti.me/api/buildingsnew");
    lookup = lookup.data;
    actual_name.value = lookup[search];
    isDataLoaded.value = true;
  }
  if (type == "Course") {
    // course_ratings/courses
    await axios
      .post("https://api.boilerti.me/api/get/course_ratings/courses", {
        course_name: result.value.replace(/ /g, ""),
      })
      .then((response) => {
        console.log(response.data);
        resultData.value.push(response.data);
        isDataLoaded.value = true;
      });
  }
  if (type == "TA") {
    // ta_ratings/tas
    await axios
      .post("https://api.boilerti.me/api/get/ta_ratings/tas", {
        ta: result.value,
      })
      .then((response) => {
        var data = response.data;
        actual_course.value = tas_inv.value[result.value];
        resultData.value.push(response.data);
        isDataLoaded.value = true;
      });
  }
}

const user_id = ref("");

async function getUserInfo() {
  try {
    if (userStore.user_id == null) {
      user_id.value = "guest";
    }
  } catch (err) {
    return;
  }
  user_id.value = userStore.user_id;
  axios
    .post(
      "https://api.boilerti.me/api/get/profile/",
      {
        user_id: userStore.user_id,
      },
      config
    )
    .then((response) => {
      firstname.value = response.data.firstname;
      lastname.value = response.data.lastname;
      gradMonth.value = response.data.grad_month;
      gradYear.value = response.data.grad_year;
      isGradStudent.value = response.data.is_grad_student;
      email.value = response.data.email;
      pairs.value = response.data.pairs;
      privacy.value = response.data.privacy;
    })
    .catch((error) => {
      console.error(error);
    });
  axios
    .post(
      "https://api.boilerti.me/api/get/darkmode/",
      {
        user_id: userStore.user_id,
      },
      config
    )
    .then((response) => {
      userStore.user.dark_mode = response.data.dark_mode;
    })
    .catch((error) => {
      console.error(error);
    });
}

async function submitAllCookies() {
  axios
    .post(
      "https://api.boilerti.me/api/update/profile",
      {
        user_id: userStore.user_id,
        firstname: firstname.value,
        lastname: lastname.value,
        classification_year: "Freshman",
        grad_month: gradMonth.value,
        grad_year: gradYear.value,
        is_grad_student: isGradStudent.value,
        pairs: true,
        privacy: true,
      },
      config
    )
    .then((response) => {
      if (response.data["accessToken"] != undefined) {
        userStore.user = {
          accessToken: response.data["accessToken"],
          //refreshToken: response.data["refreshToken"],
          user_id: user_id,
        };
      }
      privacyPopup.value = false;
    })
    .catch((error) => {
      console.error(error);
    });
}

async function submitNecssaryCookies() {
  axios
    .post(
      "https://api.boilerti.me/api/update/profile",
      {
        user_id: userStore.user_id,
        firstname: firstname.value,
        lastname: lastname.value,
        classification_year: "Freshman",
        grad_month: gradMonth.value,
        grad_year: gradYear.value,
        is_grad_student: isGradStudent.value,
        pairs: false,
        privacy: false,
      },
      config
    )
    .then((response) => {
      console.log("changed cookies");
      if (response.data["accessToken"] != undefined) {
        userStore.user = {
          accessToken: response.data["accessToken"],
          //refreshToken: response.data["refreshToken"],
          user_id: user_id,
        };
      }
      privacyPopup.value = false;
    })
    .catch((error) => {
      console.error(error);
    });
}

async function convertSchedule(schedule) {
  for (const course of schedule) {
    for (const meeting of course.meetings) {
      console.log(meeting.startTime)
      const startDateTime = new Date(meeting.startTime);
      const easternStartTime = startDateTime.toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour12: false });
      const duration = meeting.duration.slice(2).toLowerCase();
      const durationParts = duration.split(/h|m/).map(part => parseInt(part));
      const easternEndTimeDateTime = new Date(startDateTime.getTime() + (durationParts[0] * 60 + durationParts[1]) * 60 * 1000);
      const easternEndTime = easternEndTimeDateTime.toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour12: false });
      const daysOfWeek = meeting.daysOfWeek.map(day => ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(day));
      const id = `${course.subject}${course.number}`;
      async function getgpa(prof_name, class_name) {
        const response = await axios.post('https://api.boilerti.me/api/getgpa', {
          "prof_name": prof_name,
          "class_name": class_name
        }, config)
        return response?.data?.averageGPA || 0.0
      }
      async function getrmp(prof_name) {
        const response = await axios.post('https://api.boilerti.me/api/ratemyprofessor', {
          "prof_name": prof_name
        }, config)
        return response?.data?.avgRating || 0.0
      }
      resultSchedule.value.push({
        startTime: easternStartTime,
        endTime: easternEndTime,
        title: course.subject + " " + course.number,
        daysOfWeek: daysOfWeek,
        id: id,
      });
    }
  }
}


onBeforeMount(async () => {
  await getUserInfo();
  await fetch();

  await axios.post('https://api.boilerti.me/api/get/term/optimizedschedule', {
    user_id: userStore.user_id,
    term_id: "spring_2023",
  }, config).then((response) => {
      console.log(response.data + response.data.time);
      scheduleData.value = response.data.schedule
      convertSchedule(response.data.schedule)
      console.log(resultSchedule.value);
  }).catch((error) => {
    console.log("THIS IS THE ERROR " + error)
  });
});
</script>
