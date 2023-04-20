<template>
  <main>
    <div class="ml-16 mr-8">
      <NavBar bgColor="white" />
    </div>
    <section class="flex items-center justify-center h-screen p-24 bg-gray-100 dark:bg-neutral-600 align-center">
    <div class="grid grid-cols-5 gap-x-20">
      <div class="col-span-2">
        <div class="text-4xl font-bold text-black dark:text-gray-200">
          Get started with
        </div>
        <div class="text-4xl font-bold text-yellow-500">
          building your schedule
        </div>
        <div class="relative mt-8">
          <label class="font-semibold text-lg dark:text-gray-200">📈 Trending classes:</label>
          <draggable v-model="trending_classes" group="classes" item-key="id"
            class="relative flex p-3 mt-3 border-2 border-gray-300 border-dashed rounded-lg">
            <template #item="{ element }">
              <div class="text-sm font-bold border dark:border-black p-1.5 bg-indigo-500 text-white rounded-md mr-3 hover:bg-red-500">
                {{ element }}
              </div>
            </template>
          </draggable>
        </div>
        <div class="relative mt-8">
          <label class="font-semibold text-lg dark:text-gray-200">⭐ Classes usually taken together with {{ lastEntered }}:</label>
          <draggable v-model="together_classes" group="classes" item-key="id"
            class="relative flex p-3 mt-3 border-2 border-gray-300 border-dashed rounded-lg">
            <template #item="{ element }">
              <div class="text-sm font-bold border dark:border-black p-1.5 bg-indigo-500 text-white rounded-md mr-3 hover:bg-red-500">
                {{ element }}
              </div>
            </template>
          </draggable>
        </div>
      </div>
      <div class="p-12 bg-white rounded-lg shadow-2xl dark:bg-neutral-700 col-span-3">
        <div class="relative">
          <div class="mb-8">

          </div>
          <label class="font-semibold text-md dark:text-gray-200">Add classes you have to take:</label>
          <input v-model="searchTerm"
            class="w-full px-4 py-2 mt-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 dark:bg-neutral-500 dark:placeholder-neutral-600 focus:ring-indigo-500 focus:border-indigo-500 dark:border-black"
            placeholder="Search for classes..." @keyup.enter="addSingleResultToSelected">
          <ul v-if="isSearchActive && filteredResults.length > 0"
            class="absolute z-10 w-full mt-1 overflow-scroll bg-white rounded-lg shadow-lg dark:bg-neutral-600 dark:text-gray-200 outline-black max-h-48">
            <li v-for="result in filteredResults" :key="result"
              class="px-4 py-2 cursor-pointer hover:bg-indigo-500 hover:text-white" @click="addToSelected(result)">
              <span class="flex items-center bg-yellow-500" v-if="bookmarked_classes.includes(result)">
                <BookmarkIcon class="w-4 mr-2" />
                <span>{{ result }}</span>
              </span>
              <span v-else>{{ result }}</span>
            </li>
          </ul>
          <draggable v-model="selectedRequiredCourses" group="classes" item-key="id" class="flex flex-wrap">
            <template #item="{ element, index }">
              <div class="text-sm font-bold border dark:border-black p-1.5 bg-indigo-500 text-white rounded-md mr-3 mt-3 hover:bg-red-500"
                @click="removeFromSelected(index)">
                {{ element }}
              </div>
            </template>
          </draggable>
          <div class="relative mt-8">
            <label class="font-semibold text-md dark:text-gray-200">Add classes you want to take:</label>
            <input v-model="optionalSearchTerm"
              class="w-full px-4 py-2 mt-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 dark:bg-neutral-500 dark:placeholder-neutral-600 focus:ring-indigo-500 focus:border-indigo-500 dark:border-black"
              placeholder="Search for classes..." @keyup.enter="addSingleOptionalToSelected">
            <ul v-if="isOptionalSearchActive && filteredOptionalResults.length > 0"
              class="absolute z-10 w-full mt-1 overflow-scroll bg-white rounded-lg shadow-lg dark:bg-neutral-600 dark:text-gray-200 outline-black max-h-48">
              <li v-for="result in filteredOptionalResults" :key="result"
                class="px-4 py-2 cursor-pointer hover:bg-indigo-500 hover:text-white"
                @click="addToSelectedOptional(result)">
                {{ result }}
              </li>
            </ul>
            <draggable v-model="selectedOptionalCourses" group="classes" item-key="id" class="flex flex-wrap">
              <template #item="{ element, index }">
                <div class="text-sm font-bold border dark:border-black p-1.5 bg-indigo-500 text-white rounded-md mr-3 mt-3 hover:bg-red-500"
                  @click="removeOptional(index)">
                  {{ element }}
                </div>
              </template>
            </draggable>
          </div>
          <div class="relative mt-8">
            <label class="font-semibold text-md dark:text-gray-200">Drag classes here to bookmark them for later:</label>
            <draggable v-model="bookmarked_classes" group="classes" item-key="id"
              class="relative flex p-3 mt-3 border-2 border-gray-300 border-dashed rounded-lg">
              <template #item="{ element, index }">
                <div class="text-sm font-bold border dark:border-black p-1.5 bg-indigo-500 text-white rounded-md mr-3 hover:bg-red-500"
                  @click="removeFromBookmarked(index)">
                  {{ element }}
                </div>
              </template>
            </draggable>
          </div>
          <div class="mt-8">
            <button @click="showPrefMenu()" class="p-2 font-bold text-white bg-yellow-500 border hover:bg-yellow-700 text-md dark:border-black rounded-md">
              Customize Preferences
            </button>
            <button @click="submit" class="float-right p-2 font-bold text-white bg-yellow-500 border hover:bg-yellow-700 text-md dark:border-black rounded-md">
              Submit
            </button>

            <button @click="blockConfig = true" class="float-middle p-2 font-bold text-white bg-yellow-500 border hover:bg-yellow-700 text-md dark:border-black rounded-md">
              Block Time
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
  </main>

  <TransitionRoot :show="isOpen" as="template">
    <Dialog as="div" class="relative z-10">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black bg-opacity-25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div
          class="flex items-center justify-center min-h-full p-4 text-center"
        >
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              
              class="w-full max-w-md p-6 overflow-hidden text-left align-middle bg-white shadow-xl transform rounded-2xl dark:bg-neutral-700 transition-all"
            >
              <DialogTitle
                as="h1"
                class="text-xl text-center font-large leading-6 dark:text-gray-200"
                style="font-size: 30px;"
              >
                <b>{{status}}</b><span class="loader__dot">.</span><span class="loader__dot">.</span><span class="loader__dot">.</span>
              </DialogTitle>
              <div class="mt-2">
                <p v-if="!inLine" class="text-sm text-center text-gray-500 dark:text-gray-200">
                  We're building your perfect schedule. This might take a bit
                </p>
                <p v-else class="text-sm text-center text-gray-500 dark:text-gray-200">
                  Waiting in line: Position {{posInLine}} of {{totalPos}}
                </p>

                <p v-if="inLine" class="text-sm text-center text-gray-500 dark:text-gray-200">
                  Expected wait: {{mins}}
                </p>
                <!--div class="content-center w-32 h-32 border-t-2 border-b-2 border-green-600 rounded-full animate-spin" style="text-align: center;"></div-->
                <br/>
                <div v-if="multiLoader" class="items-center justify-center">
                  <div class="flex items-center justify-center">
                    <div class="flex items-center justify-center rounded-full h-28 w-28 bg-gradient-to-tr from-yellow-500 to-gray-500 animate-spin">
                    <div class="w-20 h-20 bg-white rounded-full dark:bg-neutral-700"></div>
                  </div>
                </div>
              </div>
                <div class="mt-2" v-if="algorithmProgress">
                  <p class="text-sm text-gray-500 dark:text-gray-200">Progress:</p>
                  <ProgressBar :bgcolor="'#6a1b9a'" :completed="completed"  style="width:100%"/>
                </div>
              </div><br/>
              <button @click="cancel()" class="p-2 font-bold text-white bg-yellow-500 border hover:bg-yellow-700 text-md dark:border-black rounded-md" style="align: text-center;" >
                Cancel
              </button>
              <button @click="displayTips = true" class="float-right p-2 font-bold text-white bg-yellow-500 border hover:bg-yellow-700 text-md dark:border-black rounded-md" style="align: text-right;" >
                Tips
              </button>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>

  <TransitionRoot :show="isResultOpen" as="template">
    <Dialog as="div" class="relative z-10">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black bg-opacity-25" />
      </TransitionChild>
      <div class="fixed inset-0 overflow-y-auto">
        <div
          class="flex items-center justify-center min-h-full p-4 text-center"
        >
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="w-full max-w-md p-6 overflow-hidden text-left align-middle bg-white shadow-xl transform rounded-2xl transition-all"
            >
              <DialogTitle
                as="h1"
                class="text-xl font-medium text-center text-gray-900 leading-6"
              >
                We're Done -- Quick Question
              </DialogTitle>
              <div class="mt-2">
                <p class="text-sm text-gray-500">
                  Which Schedule Looks Good to You?
                </p>
                <p class="text-xs text-gray-500"><i>Note, becuase optimization relies on ML, some options may not look correct. </i></p>
              </div>
                          <!-- Data items -->
            <div v-for="(schedule, index) in schedule" :key="schedule" class="p-4 cursor-pointer"
              @click="getScheduleView(index)">
              <div
                class="flex flex-col justify-between w-full h-full overflow-hidden bg-gray-100 border-2 border-gray-400 rounded-lg hover:bg-blue-100 transition duration-300">
                <div class="flex items-center flex-grow justify-left" style="margin-left: 5%; margin-top: 5%; margin-right: 5%;">
                  <div>
                   <span class="text-sm text-black" 
                      >{{ schedule }} <br/>
                    </span><br/>
                  </div>
                </div>
                </div>
            </div>




            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>

  <TransitionRoot :show="isPreferencesOpen" as="template">
    <Dialog as="div" class="relative z-10">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black bg-opacity-25" />
      </TransitionChild>
      <div class="fixed inset-0 overflow-y-auto">
        <div
          class="flex items-center justify-center min-h-full p-4 text-center"
        >
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="w-full max-w-md p-6 overflow-hidden text-left align-middle bg-white shadow-xl transform rounded-2xl transition-all"
            >
              <DialogTitle
                as="h1"
                class="text-xl font-medium text-center text-gray-900 leading-6"
              >
                Your Schedule <span class="text-yellow-500">Preferences</span>
              </DialogTitle>
              <div class="mt-2">
                <p class="text-sm text-gray-500">
                  Let's make a schedule that <span class="text-yellow-500">works for you</span>
                </p>
                            <!-- Data items -->
                            <br/>
              <label class="font-semibold text-md dark:text-gray-200">Select your preference order:</label>
              <div class="flex justify-center">
                <div class="w-64">
                  <draggable2
                    class="dragArea list-group w-full"
                    :list="state.list"
                    :sort="true"
                  >
                    <div
                      class="list-group-item bg-gray-300 m-1 p-1 rounded-md text-left cursor-move w-full"
                      v-for="(element, key) in state.list"
                      :key="element.name"
                    >
                      {{ (key + 1) + ". " + element.name }}
                    </div>
                  </draggable2>
                </div>
              </div>
              <p class="text-sm text-gray-500">
                  Drag <span class="text-yellow-500">and drop</span> to reorder
                </p>
              <br/>
              <label class="font-semibold text-md dark:text-gray-200">Select your time of day preference:</label>
                <fieldset class="mt-2">
                  <div class="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
                    <div v-for="(time, index) in timePreference" :key="time.id" class="flex items-center">
                      <input :id="time.id" type="radio" :checked="time.id === time_pref" :value="time.id" v-model="time_pref" class="w-4 h-4" />
                      <label :for="time.id" class="block ml-3 text-sm font-medium text-gray-900 leading-6 dark:text-gray-200">{{ time.title }}</label>
                    </div>
                  </div>
                </fieldset>
              </div>
              <br/>
              <label class="font-semibold text-md dark:text-gray-200">How many classes do you want to take?</label>
              <div>
                <input class="shadow appearance-none border border-yellow-500 rounded w-half py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" v-model="courseCount" placeholder="Between 1 and 5 Courses" @input="validateInput()">

              </div>
              <div class="mt-2">
                <p class="text-xs text-gray-500"><i>Note, because optimization relies on Artificial Inteligence, we can't guarentee your preferences will be honored </i></p>
              </div>
              <button @click="hidePreferences()" class="float-right bg-yellow-500 hover:bg-green-700 text-white p-2 text-md font-bold border dark:border-black rounded-md" style="align: text-right;" >
                Save
              </button>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>


  <TransitionRoot :show="blockConfig" as="template">
    <Dialog as="div" class="relative z-10">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black bg-opacity-25" />
      </TransitionChild>
      <div class="fixed inset-0 overflow-y-auto">
        <div
          class="flex items-center justify-center min-h-full p-4 text-center"
        >
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="w-full max-w-md p-6 overflow-hidden text-left align-middle bg-white shadow-xl transform rounded-2xl transition-all"
            >
              <DialogTitle
                as="h1"
                class="text-xl font-medium text-center text-gray-900 leading-6"
              >
                Your <span class="text-yellow-500">Blocked Times</span>


              </DialogTitle>
              <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <p class="text-sm text-gray-500 text-left">
                  Have a meeting? Need some time off? Let's find times that <span class="text-yellow-500">work for you</span>
                </p>
              </div>
              <div v-for="(entry, index) in blockArray" style=" transition: width 2s;">
                  <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <label><b>Block {{index + 1 }}: {{entry.name}}</b>
                      <button type="button" class="float-right text-red-700 border border-red-700 hover:bg-red-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800 dark:hover:bg-blue-500" @click="deleteBlock(index)"><TrashIcon class="w-4 h-4" /><span class="sr-only">Delete</span></button>
                    </label>
                    <p>Start Time: {{entry.start}}</p>
                    <p>Duration: {{entry.duration}}</p>
                    
                    <br/>
                    <div class="flex items-left justify-left">
                      <div class="grid grid-cols-5 grid-rows-1 gap-4 bg-gray-200 rounded-xl border-4">
                        <div>
                          <input type="radio" :id="'Monday'+index" class="peer hidden" :checked="entry.daysOfWeek[0] == true" v-on:click="entry.daysOfWeek[0] = !entry.daysOfWeek[0]"/>
                          <label :for="'Monday'+index" class="col-start-4 block cursor-pointer select-none rounded-xl p-2 text-center peer-checked:bg-blue-500 peer-checked:font-bold peer-checked:text-white">M</label>
                        </div>
                        <div>
                          <input type="radio" :id="'Tuesday'+index" class="peer hidden" :checked="entry.daysOfWeek[1] == true" v-on:click="resetArray(index, 1)"/>
                          <label :for="'Tuesday'+index" class="col-start-4 block cursor-pointer select-none rounded-xl p-2 text-center peer-checked:bg-blue-500 peer-checked:font-bold peer-checked:text-white">T</label>
                        </div>
                        <div>
                          <input type="radio" :id="'Wednesday'+index" class="peer hidden" :checked="entry.daysOfWeek[2] == true" v-on:click="resetArray(index, 2)"/>
                          <label :for="'Wednesday'+index" class="col-start-4 block cursor-pointer select-none rounded-xl p-2 text-center peer-checked:bg-blue-500 peer-checked:font-bold peer-checked:text-white">W</label>
                        </div>
                        <div>
                          <input type="radio" :id="'Thursday'+index" class="peer hidden" :checked="entry.daysOfWeek[3] == true" v-on:click="resetArray(index, 3)"/>
                          <label :for="'Thursday'+index" class="col-start-4 block cursor-pointer select-none rounded-xl p-2 text-center peer-checked:bg-blue-500 peer-checked:font-bold peer-checked:text-white">R</label>
                        </div>
                        <div>
                          <input type="radio" :id="'Friday'+index" class="peer hidden" :checked="entry.daysOfWeek[4] == true" v-on:click="resetArray(index, 4)"/>
                          <label :for="'Friday'+index" class="col-start-4 block cursor-pointer select-none rounded-xl p-2 text-center peer-checked:bg-blue-500 peer-checked:font-bold peer-checked:text-white">F</label>
                      </div>
                    </div>
                  </div>
                </div>
                <br/>
              </div>

              <div class="mb-4">
                <button @click="showSectionConfig()" class="w-full text-indigo-100 transition-colors duration-150 bg-indigo-700 rounded-lg focus:shadow-outline hover:bg-indigo-800">{{ blockOption }}</button>
                <br/>
              </div>
              <div v-if="isAddingBlock">
                <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" autocomplete="off" id="blockInputForm">
                  <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="block_name">
                      Block Name
                    </label>
                    <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" v-model="block_name" type="text" placeholder="Block Name">
                  </div>
                  <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="start_time">
                      Start Time
                    </label>
                    <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="time" v-model="startTime" name="Start Time" required>
                  </div>
                  <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="start_time">
                      End Time
                    </label>
                    <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="time" v-model="endTime" name="End Time" required>
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">
                      Days of Week
                    </label>
                  <div class="flex items-center justify-center" style="Display: block;">
                        <div class="grid grid-cols-5 grid-rows-1 gap-4 bg-gray-200 rounded-xl">
                          <div v-for="(days, index) in daysPref">
                            <input type="radio" :id="days" class="peer hidden" :checked="dayPrefActive[index]" v-on:click="dayPrefActive[index] = !dayPrefActive[index]"/>
                            <label :for="days" class="col-start-4 block cursor-pointer select-none rounded-xl p-2 text-center peer-checked:bg-blue-500 peer-checked:font-bold peer-checked:text-white">{{days}}</label>
                          </div>
                      </div>
                    </div>
                  </div>
                  <br/>
                  <div class="mb-4">
                    <button class="float-right bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button" @click="saveBlock()"> Save </button>
                  </div>
                </form>
              </div>
              <div class="mb-4">
                <button @click="closeBlocks()" class="float-right p-2 font-bold text-white bg-yellow-500 border hover:bg-yellow-700 text-md dark:border-black rounded-md" style="align: text-right;" >
                Close
              </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>

  <TransitionRoot :show="displayTips" as="template">
    <Dialog as="div" class="relative z-10">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black bg-opacity-25" />
      </TransitionChild>
      <div class="fixed inset-0 overflow-y-auto">
        <div
          class="flex items-center justify-center min-h-full p-4 text-center"
        >
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="w-full p-6 overflow-hidden text-left align-middle bg-white shadow-xl max-w-l transform rounded-2xl transition-all"
            >
              <DialogTitle
                as="h1"
                class="text-xl font-medium text-center text-black leading-6"
                style="font-size: 36px;"
              >
                <b>About BoilerTime</b>
              </DialogTitle>
              <div>
                <p class="text-xl">
                  How it Works
                </p>
                <ul class="text-sm list-disc list-inside">
                  <li>We use an advanced algorithm that uses data like coure times and RMP ratings then combine it with your preferences</li>
                  <li>After generating literally thousands of options, we select the best couple of options and make those your schedules</li>
                  <li>Becuase the algorithm uses a lot of processing power, we can only let a limited number of devices use it at once</li>
                </ul>
              </div>
              <br/>
              <div>
                <p class="text-xl">
                  How to Use It
                </p>
                <ul class="text-sm list-disc list-inside">
                  <li>It looks like you're already an expert! Congrats on making a schedule</li>
                  <li>Next time, look at our hub first to discover classes you might want to take and see a bit of info first
                  <ul class="text-sm list-none list-inside" style="margin-left: 1%">
                    <li> - That way, you can see if the right professors, times of day, or locations are there for you</li>
                    <li> - You can always bookmark a course to come back later if you're not satisfied</li>
                  </ul></li>
                  <li>Becuase the algorithm uses a lot of processing power, we can only let a limited number of devices use it at once</li>
                  <ul class="text-sm list-none list-inside" style="margin-left: 1%">
                    <li> - To save everyone time and money, take a look over the class options before optimizing</li>
                    <li> - Never re-optimize the same schedule unless you don't like any of the results</li>
                    <li> - If you've inputted optional classes that don't show up in any of the options, remove another class before re-optimizing</li>
                  </ul>
                  <li>Be realistic about the number of classes you'd like to take, the number of classes inputted will be filled</li>
                </ul>
              </div>
              <button @click="closeTips()" class="p-2 font-bold text-white bg-yellow-500 border float-middle hover:bg-red-700 text-md dark:border-black rounded-md" style="align: text-center;" >
                Close
              </button>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
/*
 * Status Possibilities
 * 1) Getting data for schedule from backend
 * 2) Sending schedule data to algorithm
 * 3) Waiting in line for optimization 
 * 4) Optimizing
 */
import { ref, computed, watchEffect, watch, reactive } from 'vue'
import axios from 'axios'
import { useUserStore } from "../../store/user";
import { useGuestStore } from "../../store/guest";
import ProgressBar from "../../components/ProgressBar.vue";
import { POSITION, useToast } from "vue-toastification";
import { VueDraggableNext as draggable2 } from 'vue-draggable-next'
import draggable from 'vuedraggable'

import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/vue'

import { BookmarkIcon, TrashIcon } from "@heroicons/vue/24/outline"
import { use } from 'h3';
const { $socket } = useNuxtApp()

const data = ref([])
const optionalData = ref([])
const userStore = useUserStore()
const guestStore = useGuestStore()
const time_pref = ref('')
const rmp = ref('')
const isOpen = ref(false)
const isResultOpen = ref(false);
const isPreferencesOpen = ref(false);
const completed = ref(0)
const schedule = ref('');
const toast = useToast();
const isAlgoActive = ref(false);
const status = ref('');
const algorithmProgress = ref(true)
const inLine = ref(false)
const posInLine = ref('');
const totalPos = ref('');
const multiLoader = ref(false)
const displayTips = ref(false)
const blockConfig = ref(false)
const mins = ref('');
const courseCount = ref('5');
var trending_classes = ref([]);
var together_classes = ref([]);
var configured = false; 


/*
  block configs
*/
const isAddingBlock = ref(false);
const blockOption = ref('Add Block');
const startTime = ref('')
const endTime = ref('')
const block_name = ref('');
const blockInputForm = ref();
var totalSum;

function closeModal() {
  isOpen.value = false
}
function openModal() {
  isOpen.value = true
}

var courseList; 
var resultsList = [];

var accessToken = userStore.accessToken;
const config = {
  headers: {
    'authorization': `Bearer ${accessToken}`
  }
}

const timePreference = [
  { id: 'none', title: 'None' },
  { id: 'morning', title: 'Morning' },
  { id: 'afternoon', title: 'Afternoon' },
]

const state = reactive({
      list: [
        { name: 'Time of Day', id: 1, value: "TOD" },
        { name: 'Professor Ratings', id: 2, value: "RMP" },
        { name: 'TA Ratings', id: 3, value: "TAR" }
      ],
    })

onBeforeMount(() => {
  if (userStore.user_id) {
    isAGuest.value = false
    console.log('is a guest is false' + isAGuest.value);
  }
  else {
    console.log('is a guest is true');
  }
  axios.get('http://localhost:3001/api/searchnew').then((response) => {
    data.value = response.data
  })
  axios.get('http://localhost:3001/api/searchnew').then((response) => {
    optionalData.value = response.data
  })

  axios.post('http://localhost:3001/api/getbookmarks', {
    user_id: userStore.user_id,
  }, config).then((response) => {
    bookmarked_classes.value = response.data.bookmarks
  })
  axios.get('http://localhost:3001/api/hotclasses').then((response) => {
    trending_classes.value = response.data
  })

  if (!isAGuest.value) {
    console.log('here in not a guest');
    axios.post('http://localhost:3001/api/getclasses', {
      user_id: userStore.user_id,
    }, config).then((response) => {
      selectedRequiredCourses.value = response.data.required_classes
      courseCount.value = response.data.num_courses;
      selectedOptionalCourses.value = response.data.optional_classes
      time_pref.value = response?.data?.time || "none"
      configured = response?.data?.configured || false;
      configureState(response.data.preference_list);
    })

    axios.post('http://localhost:3001/api/getbookmarks', {
      user_id: userStore.user_id,
    }, config).then((response) => {
      bookmarked_classes.value = response.data.bookmarks
    })
  }
  else {
    if (guestStore.guest.schedule.required_classes != undefined) {
      console.log('no undefined!');

      selectedRequiredCourses.value = guestStore.schedule.required_classes
      courseCount.value = guestStore.schedule.num_courses;
      selectedOptionalCourses.value = guestStore.schedule.optional_classes
      time_pref.value = guestStore.schedule.time || "none"
      configured = guestStore.schedule.configured || false;
      configureState(guestStore.schedule.preference_list);

    }
    else {
      console.log('undefined');
    }
  }
});

const searchTerm = ref('')
const filteredResults = computed(() => {
  if (!searchTerm.value) {
    return []
  }

  return data.value.filter((item) => {
    return item.toLowerCase().startsWith(searchTerm.value.toLowerCase())
  })
})

onMounted(() => {
  $socket.onopen = () => {
    console.log("Connected")
    console.log("Are we open? " + isOpen.value)
    //algorithmProgress.show = true
  }
  $socket.onmessage = ((data) => {
    console.log("data", (data.data))
    try {
      let response = JSON.parse(data.data);
      console.log("STATUS" + response.status)
      if(response?.message == "schedule") {
        parseCoursesResponse(response.data);
      } else if (response?.message == "Status Update") {
        //isAlgoActive.value = true;
        optimizing(response.data);
      } else if (response?.status == 102 && response?.message == "Position in Queue Update") {
        inQueue(response.data.currentPos, response.data.totalWaiting);
      } else if(response.status === 404) {
          console.log("ERROR!!")
          toast.error("No Schedule Found!! Please try again ", {
            timeout: 5000,
            position: POSITION.BOTTOM_RIGHT
          });
          
        }
    } catch (e) {
      console.log("Wasnt JSON!!" + e)
    }
})

  $socket.onclose = function () {
    console.log("disconnected")
  }

})

const selectedRequiredCourses = ref([])
const isSearchActive = ref(false)

function addToSelected(item) {
  console.log(item)
  if (selectedRequiredCourses.value.length < 5 && !selectedRequiredCourses.value.includes(item) && !selectedOptionalCourses.value.includes(item)) {
      selectedRequiredCourses.value.push(item)
      isSearchActive.value = false
      searchTerm.value = ''
      saveScheduleToDB();
  } else {
    if (selectedRequiredCourses.value.length >= 5) {
      alert('You can only select 5 required courses')
      searchTerm.value = ''
    }
    if (selectedOptionalCourses.value.includes(item)) {
      alert('You cannot select the same course twice')
      searchTerm.value = ''
    }
  }
}

function addSingleResultToSelected() {
  if (filteredResults.value.length >= 1) {
    addToSelected(filteredResults.value[0])
  }
}

function addSingleOptionalToSelected() {
  if (filteredOptionalResults.value.length >= 1) {
    addToSelectedOptional(filteredOptionalResults.value[0])
  }
}

const optionalSearchTerm = ref('')
const filteredOptionalResults = computed(() => {
  if (!optionalSearchTerm.value) {
    return []
  }

  return optionalData.value.filter((item) => {
    return item.toLowerCase().startsWith(optionalSearchTerm.value.toLowerCase())
  })
})


const selectedOptionalCourses = ref([])
const isOptionalSearchActive = ref(false)

function addToSelectedOptional(item) {
  if (selectedOptionalCourses.value.length < 5 && !selectedOptionalCourses.value.includes(item) && !selectedRequiredCourses.value.includes(item)) {
    selectedOptionalCourses.value.push(item)
    isOptionalSearchActive.value = false
    optionalSearchTerm.value = ''
    saveScheduleToDB();
  } else {
    if (selectedOptionalCourses.value.length > 5) {
      alert('You can only select 5 optional courses')
      optionalSearchTerm.value = ''
    }
    if (selectedRequiredCourses.value.includes(item)) {
      alert('You cannot select the same course twice')
      optionalSearchTerm.value = ''
    }
  }
}

function removeFromSelected(index) {
  selectedRequiredCourses.value.splice(index, 1)
  saveScheduleToDB()
}

function removeOptional(index) {
  selectedOptionalCourses.value.splice(index, 1);
  saveScheduleToDB();
}

function removeFromBookmarked(index) {
  bookmarked_classes.value.splice(index, 1);
  axios.post('http://localhost:3001/api/removebookmark', {
    user_id: userStore.user_id,
    class_name: bookmarked_classes.value
  }, config).then(() => {
    console.log('Bookmark removed')
  })
}

const bookmarked_classes = ref([])
function addToBookmarked(item) {
  if (!this.bookmarked_classes.includes(item)) {
    this.bookmarked_classes.push(item);
  }
  if(isAGuest.value) {
    guestStore.bookmarked_classes = this.bookmarked_classes;
  }
}

watchEffect(() => {
  if (searchTerm.value.length > 0) {
    isSearchActive.value = true
  } else {
    isSearchActive.value = false
  }
})

watchEffect(() => {
  if (optionalSearchTerm.value.length > 0) {
    isOptionalSearchActive.value = true
  } else {
    isOptionalSearchActive.value = false
  }
})

watch(bookmarked_classes, (newVal, oldVal) => {
  if (newVal.length > oldVal.length) {
    const newBookmark = newVal[newVal.length - 1]
    if (!isAGuest.value) {
      console.log(`New bookmark added: ${newBookmark}`)
      console.log(bookmarked_classes.value)
      axios.post('http://localhost:3001/api/addbookmark', {
        user_id: userStore.user_id,
        class_name: bookmarked_classes.value
      }, config).then(() => {
        console.log('Bookmark added')
      })
    }
    else {
      guestStore.guest.bookmarked_classes = newVal; 
    }
  }
  if (newVal.length < oldVal.length) {
    const removedBookmark = oldVal[oldVal.length - 1]
    if (!isAGuest.value) {
    console.log(`Bookmark removed: ${removedBookmark}`)
    console.log(`Bookmark removed: ${removedBookmark}`)
    console.log(bookmarked_classes.value)
      console.log(`Bookmark removed: ${removedBookmark}`)
    console.log(bookmarked_classes.value)
      axios.post('http://localhost:3001/api/removebookmark', {
        user_id: userStore.user_id,
        class_name: bookmarked_classes.value
      }, config).then(() => {
        console.log('Bookmark removed')
      })
    }
    else {
      guestStore.guest.bookmarked_classes.remove(oldVal[oldVal.length - 1]);
    }
  }
})

watch(selectedRequiredCourses, (newVal, oldVal) => {
  
})

watch(selectedOptionalCourses, (newVal, oldVal) => {
  
})

var isAGuest = ref(true)

onMounted(async () => {
})

function submit() {
   if (isAGuest.value) {
    toast.error("You must be logged in to use the optimizer!", {
      timeout: 5000,
      position: POSITION.TOP_CENTER
    });
    return
  }

  if (getNumCourses() < selectedRequiredCourses.value.length) {
    toast.error(("Your settings only contain " + getNumCourses() + " course" + pluralize(getNumCourses()) + ", but you've inputted " + (selectedRequiredCourses.value.length) + " required course"  + pluralize((selectedRequiredCourses.value.length))) , {
      timeout: 5000,
      position: POSITION.TOP_CENTER
    });
    return
  }

  if (getNumCourses() > selectedRequiredCourses.value.length + selectedOptionalCourses.value.length) {
    toast.warning(("Your settings contain " + getNumCourses() + " course" + pluralize(getNumCourses()) + ", but you've inputted " + (selectedRequiredCourses.value.length + selectedOptionalCourses.value.length) + " course"  + pluralize((selectedRequiredCourses.value.length + selectedOptionalCourses.value.length)) + ". We'll round down for you.") , {
      timeout: 5000,
      position: POSITION.TOP_CENTER
    });
  }


  if (!configured) {
    toast.info("Using default settings!", {
      timeout: 5000,
      position: POSITION.BOTTOM_RIGHT
    });
  }
  if (selectedRequiredCourses.value.length > 0) {
    openModal();
    waitingForData();
    axios.post('http://localhost:3001/api/createschedule', {
      user_id: userStore.user_id,
      required_classes: selectedRequiredCourses.value,
      optional_classes: selectedOptionalCourses.value,
      time: getTimePref(),
      preference_list: getPreferenceList(),
      num_courses: getNumCourses(),
      configured: configured,
      blocked_times: calculateOutgoingArray()//[{start_time: "0830", duration: 50, days_of_week: "Monday", name: "breakfast"}, {start_time: "1230", duration: 60, days_of_week: "Monday, Tuesday, Wednesday, Thursday, Friday", name: "lunch"}]
    }, config).then((response) => {
      sendToOptimizer(response.data.schedule, response.data.blocked_times, response.data);
      courseList = response.data.schedule;
      isAlgoActive.value = false;

      console.log(courseList)
      if (response.data["accessToken"] != undefined) {
        userStore.user = {
          accessToken: response.data["accessToken"],
          //refreshToken: response.data["refreshToken"],
          user_id: user_id
        }
        accessToken = userStore.accessToken;
        config.headers['authorization'] = `Bearer ${accessToken}`;
      }
      //navigateTo('/app/view')
    })
  } else {
    console.log("Error: No classes!")
  }
  console.log("List: ")

  
}

function sendToOptimizer(courses, blocks, configurations) {
  if($socket.readyState != $socket.OPEN) {
    toast.error("Error: Couldn't connect to algorithm. Please reload this page and try again", {
          timeout: 5000,
          position: POSITION.BOTTOM_RIGHT
        });
  }
  //We first need to send them number of classes we will be optimzing by
  $socket.send(courses.length)
  $socket.send(blocks.length);
  //Next, we send the time of day preferences
  
  console.log(getPreferenceList())
  $socket.send(getPreferenceList().toString());
  $socket.send(getTimePref());
  $socket.send(getNumCourses());
  /*
    * Take care of the courses that the user has entered
  */
  for(let i = 0; i < courses.length; i++) {
    //First, we can send the name of the course
    $socket.send(courses[i].name)
    //Next, we can send the number of sections
    $socket.send(courses[i].isRequired)

    $socket.send(courses[i].startTimes.length);
    //Next, we iterate through each of the options and send the parameters of that option
    for(let j = 0; j < courses[i].startTimes.length; j++) {
      //First, we can send the start time
      $socket.send(fixTime(courses[i].startTimes[j]));
      //Durations
      $socket.send(courses[i].durations[j]);
      //Week days 
      console.log(courses[i].daysOfWeek[j]);
      $socket.send(courses[i].daysOfWeek[j]);
      //RMP
      $socket.send(courses[i].rmp[j]);
      //Section ID
      $socket.send(courses[i].sectionIDs[j]);
    }
  }
  /*
    * Take care of the blocks that the user has entered
  */
  console.log("UWU")
  console.log(blocks)
  for(let i = 0; i < blocks.length; i++) {
    $socket.send(blocks[i].name);
    $socket.send(blocks[i].start_time);
    $socket.send(blocks[i].duration);
    $socket.send(blocks[i].days_of_week.toString());
  }
}

function parseCoursesResponse(output) {
  console.log("Parsing Response!!!!!");
  displayingResults();
  let timePref = getTimePref();
  let data = output.lectures;
  let blocks = output.blocks;
  const formatString = "course_name at course_time on course_week_days"
  const blockFormatString = "block_name at block_time on block_days_of_week for block_duration minutes"
  var userOutput = [];
  console.log(data)
  console.log(blocks)
  for(let i = 0; i < data.length; i++) {
    
    //let thisFormat = [];
    let thisFormat = "";
    for(let j = 0; j < data[i].length; j++) {
      let string = "";
      if(data[i].length > 1 && j == data[i].length - 1) {
        console.log("TWT")
        string += "and "
      }
      let tempForm = new String(formatString);
      string+= tempForm;
      console.log(data[i][j]);
      string = string.replace("course_name", data[i][j].courseID);
      string = string.replace("course_time", fto2(data[i][j].courseStartTime));
      string = string.replace("course_week_days", (data[i][j].daysOfWeek));
      if(j != data[i].length - 1) {
        string += ", "
      }
      thisFormat += (string)
    }
    if(blocks.length > 0 && blocks[i].length > 0) {
      thisFormat += ". Time off: "
      for(let j = 0; j < blocks[i].length; j++) {
        let string = "";
        if(j == blocks[i].length - 1) {
          console.log("TWT")
          string += "and "
        }
        let tempForm = new String(blockFormatString);
        string+= tempForm;
        console.log(data[i][j]);
        string = string.replace("block_name", blocks[i][j].blockName);
        string = string.replace("block_time", fto2(blocks[i][j].blockStarTime));
        string = string.replace("block_duration", blocks[i][j].blockDuration);
        string = string.replace("block_days_of_week", (blocks[i][j].daysOfWeek));
        if(j != blocks[i].length - 1) {
        string += ", "
      }
      thisFormat += (string)
      }
    }
    userOutput.push(thisFormat)
  }

  schedule.value = userOutput;
  console.log("Temp Form = " + userOutput);
  
  let serverFormat = {"subject": "", "number": "", "userSections": {"meetings": [], "sectionID": ""}};
  let blockFormat = {"name": "", "start_time": "", "duration": "", "days_of_week": []}
  for(let j = 0; j < data.length; j++) {
    let serverOutput = {"configured": configured, "schedule": [], "blocked_times": []};

    for(let i = 0; i < data[j].length; i++) {
      let name = data[j][i].courseID;
      let thisFormat = JSON.parse(JSON.stringify(serverFormat));
      let indexForTarget = findCourse(name);
      //console.log("index = " + indexForTarget)
      //console.log("Data = " + JSON.stringify(data[i]))
      let indexIn = findIDIndex(indexForTarget, data[j][i].sectionId);
      thisFormat.subject = name.split(' ')[0];
      thisFormat.number = name.split(' ')[1];

      thisFormat.userSections.sectionID = (courseList[indexForTarget].collectionIDs[indexIn])
      thisFormat.userSections.meetings.push(data[j][i].sectionId);
      serverOutput.schedule.push(thisFormat)
    }
    if(blocks.length == 0) {
      resultsList.push(serverOutput);
      continue;
    }
    for(let i = 0; i < blocks[j].length; i++) {
      let thisFormat = JSON.parse(JSON.stringify(blockFormat));
      thisFormat.name = blocks[j][i].blockName;
      thisFormat.start_time = blocks[j][i].blockStarTime;
      thisFormat.duration = blocks[j][i].blockDuration;
      thisFormat.days_of_week = blocks[j][i].daysOfWeek.split(", ");
      console.log(thisFormat)
      serverOutput.blocked_times.push(thisFormat);
    }
    resultsList.push(serverOutput);
  }
  console.log("DATA = ")
  console.log(resultsList);
} 


function findCourse(target) {
  for(let i = 0; i < courseList.length; i++) {
    if(courseList[i].name == target) {
      return i;
    }
  }
}

function findIDIndex(position, target) {
  for(let i = 0; i < courseList[position].sectionIDs.length; i++) {
    if(courseList[position].sectionIDs[i] == target) {
      return i;
    }
  }
}

function saveOptimizedSchedule(schedule) {
  axios.post('http://localhost:3001/api/saveoptimizedschedule', {
    data: schedule,
    user_id: userStore.user_id
  }).then(() => {
    console.log("Schedule Saved!");
  }).catch((exception) => {
    console.log("Couldn't save schedule because of " + exception);
  })
  console.log("Done!")
}

function fto2(time) {
  if(time.length == 3) {
    let hours = parseInt(time.substring(0, 1));
    let minutes = parseInt(time.substring(1, 3));
    let amPM = " am";
    if(hours >= 12) {
      amPM = " pm"
    }
    hours = parseInt(hours);
    hours = ((hours + 11) % 12 + 1);
    minutes = parseInt(minutes);
    return hours + ":" + minutes + amPM;
  } else if (time.length == 4) {
    let hours = parseInt(time.substring(0, 2));
    let minutes = parseInt(time.substring(2, 4));
    let amPM = " am";
    if(hours >= 12) {
      amPM = " pm"
    }
    console.log(hours + " " + minutes)
    if(hours > 12) {
      hours = hours - 12;
    }
    console.log(hours)
  
    return hours + ":" + minutes + amPM;
  }
}
function cancel() {
  //$socket.close()
  console.log("CLOSING!!!")
  $socket.close();
  navigateTo('/app')
}

function getScheduleView(index) {
  saveOptimizedSchedule(resultsList[index]);
  navigateTo('/app/view/spring_2023')
}

function fixTime(time) {
  let hours = time.substring(0, 2)
  hours = parseInt(hours - 5);
  return new String(hours) + time.substring(2, 4);
}

function waitingForData() {
  const messages = ["Getting Course Data", "Talking to Server", "Getting Schedules", "Loading Options"]; 
  status.value = messages[randInt(messages.length - 1)];//"Getting Course Data"
  algorithmProgress.value = false;
  inLine.value = false;
  multiLoader.value = true;
}

function inQueue(position, size) {
  const messages = ["Waiting to Optimize", "Optimizing Soon", "Waiting", "Ready to Optimize"];
  if(!inLine.value)
    status.value = messages[randInt(messages.length - 1)];//"Getting Course Data"
  inLine.value = true;
  algorithmProgress.value = false;
  posInLine.value = position;
  totalPos.value = size;
  multiLoader.value = true;
  mins.value = (position / 2).toPrecision(2) + " Minute" + pluralize((position / 2).toPrecision(1))
}

function optimizing(progress) {
  const messages = ["Optimizing", "Loading Perfection", "Generating Schedule", "Maximizing Schedule"];
  if(!algorithmProgress.value)
    status.value = messages[randInt(messages.length - 1)];//"Getting Course Data" 

  algorithmProgress.value = true;
  inLine.value = false;
  multiLoader.value = false;
  if(completed.value < 100) {
    //completed.value = (completed.value + response.data)%100;v
    console.log("Val: " + progress);
    var temp = completed.value + progress;
    console.log("S " + completed.value);
    if(temp > 99) {
      completed.value = 99;
    } else {
      completed.value = temp;
      //completed.value = 10;
      //sleep(5000);
    }
  }
}

function displayingResults() {
  closeModal();
  if(displayTips.value) {
    toast.info("Your optimize schedule is ready! Close this to take a look", {
          timeout: 5000,
          position: POSITION.BOTTOM_RIGHT
        });
  } else {
    isResultOpen.value = true;
  }
}

function closeTips() {
  displayTips.value = false;
  if(!isOpen.value) {
    isResultOpen.value = true;
  }
}
function randInt(max) {
    return Math.floor(Math.random() * max) + 1;
}

function pluralize(value) {
  if(value == 1) {
    return ""
  }
  return "s";
}

function validateInput() {
  if(courseCount.value == "") {
    console.log("EMPTY")
  } else if(!(new RegExp(/^[1-5]$/).test(courseCount.value))) {
    courseCount.value = 1;
    toast.error("You must enter at least 1 class and at most 5 classes", {
            timeout: 1000,
            position: POSITION.BOTTOM_RIGHT
    });
  }
}

function getPreferenceList() {
  let result = [];
  for(let i = 0; i < state.list.length; i++) {
    result.push(state.list[i].value);
  }

  return result;
}

function hidePreferences() {
  console.log(selectedOptionalCourses.value);
  console.log(getTimePref())
  isPreferencesOpen.value = false;
  configured = true;
  saveScheduleToDB();
}

function getTimePref() {
  return time_pref.value;
}

function getNumCourses() {
  if(!(new RegExp(/^[1-5]$/).test(courseCount.value))) {
    return 1;
  }
  return courseCount.value;
}

function showPrefMenu() {
  console.log(time_pref);
  console.log(timePreference[time_pref.value]);
  isPreferencesOpen.value = true;
}

function configureState(data) {
  try {
    let temp = [];
    for(let i = 0; i < data.length; i++) {
      temp.push(state.list.find(entry => entry.value === data[i]));
    }
    state.list = temp;
  } catch(e) {

  }
}

const blockArray = ref([]);

const daysPref = ref(
  ["M", "T", "W", "R", "F"]
)

const daysOfWeekFull = ["Monday", "Tuesday", "Wednesday", 'Thursday', "Friday"];

const dayPrefActive = ref(
  [false, false, false, false, false]
)


function resetArray(index, specIndex) {
  console.log("Called!!" + index + " " + specIndex);
  console.log(blockArray.value[index].daysOfWeek);
  blockArray.value[index].daysOfWeek[specIndex] = !blockArray.value[index].daysOfWeek[specIndex];
}


function showSectionConfig() {
  if(isAddingBlock.value == false && blockArray.value.length < 5) {
    isAddingBlock.value = true;
    blockOption.value = "Hide"
  } else if (isAddingBlock.value == true) {
    isAddingBlock.value = false;
    blockOption.value = "Add Block"
  } else {
    toast.error("You can't add anymore blocks!", {
            timeout: 5000,
            position: POSITION.BOTTOM_RIGHT
    });
  }
}

function saveBlock() {
  
  let starting = startTime.value;
  let ending = endTime.value;
  if(starting == "" || ending == "") {
    toast.error("You haven't configured times yet!", {
            timeout: 5000,
            position: POSITION.BOTTOM_RIGHT
    });
    return;
  }
  let startingSplit = starting.split(":");
  let endingSplit = ending.split(":")

  let startingHour = parseInt(startingSplit[0]);
  let endingHour = parseInt(endingSplit[0]);

  let startingMinute = parseInt(startingSplit[1]);
  let endingMinute = parseInt(endingSplit[1]);

  if(startingHour > endingHour) {
    toast.error("You can't start after you end!", {
            timeout: 5000,
            position: POSITION.BOTTOM_RIGHT
    });
    return;
  } else if(startingHour == endingHour) {
      if(startingMinute > endingMinute) {
        toast.error("You can't start after you end!", {
              timeout: 5000,
              position: POSITION.BOTTOM_RIGHT
      });
      return;
    }
  }

  if(!block_name.value || /^\s*$/.test(block_name.value)) {
    toast.error("You need to enter a name for your block!", {
              timeout: 5000,
              position: POSITION.BOTTOM_RIGHT
      });
      return;
  }

  //Convert date boolean to array
  let daysWeek = [];
  for(let i = 0; i < dayPrefActive.value.length; i++) {
    if(dayPrefActive.value[i]) {
      daysWeek.push(daysOfWeekFull[i]);
    }
  }
  if(daysWeek.length == 0) {
    toast.error("You need to enter some days of the week!", {
              timeout: 5000,
              position: POSITION.BOTTOM_RIGHT
      });
      return;
  }
  console.log(daysWeek);

  //We won all the conditions, now we just need to save to the list
  const format = {
    name: block_name.value,
    start: startingHour + ":" + startingMinute,
    duration: calculateDuration(startingHour + ":" + startingMinute, endingHour + ":" + endingMinute,),
    daysOfWeek: dayPrefActive.value
  }
  blockArray.value.push(format);
  
  //Clear all the form values out then close the form
  startTime.value = "";
  endTime.value = "";
  block_name.value = "";
  dayPrefActive.value = [false, false, false, false, false];
  showSectionConfig();
  calculateOutgoingArray();
  saveScheduleToDB();
}

function deleteBlock(index) {
  console.log(index)
  blockArray.value.splice(index, 1);
  console.log(blockArray.value);
  saveScheduleToDB();
}

function calculateOutgoingArray() {
  let responseArray = [];
  for(let i = 0; i < blockArray.value.length; i++) {
    let time = blockArray.value[i].start.split(":")
    let template = {
      start_time: time[0]+""+time[1],
      name: blockArray.value[i].name,
      days_of_week: [],
      duration: blockArray.value[i].duration//calculateDuration(blockArray.value[i].start, blockArray.value[i].end)
    }
    for(let j = 0; j < blockArray.value[i].daysOfWeek.length; j++) {
      if(blockArray.value[i].daysOfWeek[j]) {
        template.days_of_week.push(daysOfWeekFull[j]);
      }
    }
    responseArray.push(template)
  }
  console.log(responseArray);
  return responseArray
}

function calculateDuration(startTime, endTime) {
  let startingSplit = startTime.split(":");
  let endingSplit = endTime.split(":")

  let startingHour = parseInt(startingSplit[0]);
  let endingHour = parseInt(endingSplit[0]);

  let startingMinute = parseInt(startingSplit[1]);
  let endingMinute = parseInt(endingSplit[1]);
  

  let startingTimeMins = 60*startingHour + startingMinute;
  let endingTimeMins = 60*endingHour + endingMinute;
  return endingTimeMins - startingTimeMins;
}

function saveScheduleToDB() {
  console.log({      
      user_id: userStore.user_id,
      required_classes: selectedRequiredCourses.value,
      optional_classes: selectedOptionalCourses.value,
      time: getTimePref(),
      preference_list: getPreferenceList(),
      num_courses: getNumCourses(),
      configured: configured,
      blocked_times: calculateOutgoingArray()})
  if(!isAGuest.value) {
    axios.post('http://localhost:3001/api/saveschedule', {
      user_id: userStore.user_id,
      required_classes: selectedRequiredCourses.value,
      optional_classes: selectedOptionalCourses.value,
      time: getTimePref(),
      preference_list: getPreferenceList(),
      num_courses: getNumCourses(),
      configured: configured,
      blocked_times: calculateOutgoingArray()
    }, config).then((response) => {
      if (response.data["accessToken"] != undefined) {
        userStore.user = {
          accessToken: response.data["accessToken"],
          //refreshToken: response.data["refreshToken"],
          user_id: user_id
        }
        accessToken = userStore.accessToken;
        config.headers['authorization'] = `Bearer ${accessToken}`;
      }
    })
  } else {
    axios.post('http://localhost:3001/api/saveschedule/guest', {
      user_id: userStore.user_id,
        required_classes: selectedRequiredCourses.value,
        optional_classes: selectedOptionalCourses.value, 
        time: getTimePref(),
        preference_list: getPreferenceList(),
        num_courses: getNumCourses(),
        configured: configured,
        blocked_times: calculateOutgoingArray()
    }).then((response) => {
      guestStore.guest.schedule = response.data.schedule;
    });
  }
}

function closeBlocks() {
  saveScheduleToDB();
  blockConfig.value = false;
}
</script>

<style scoped>
.hover\:bg-red-500:hover {
  background-color: #EF4444;
}

.hover\:bg-red-500:hover::after {
  content: ' ✖';
}

@keyframes blink {50% { color: transparent }}
.loader__dot { animation: 1s blink infinite }
.loader__dot:nth-child(2) { animation-delay: 250ms }
.loader__dot:nth-child(3) { animation-delay: 500ms }
</style>
