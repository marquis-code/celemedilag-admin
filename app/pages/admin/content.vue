<template>
  <div>
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <div>
        <h2 class="text-2xl font-display font-bold text-gray-800">Content Management</h2>
        <p class="text-gray-500 text-sm">Manage the static text, sections, and media displayed on the public website.</p>
      </div>
      <div>
        <button
          @click="saveAll"
          class="bg-royalBlue text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-royalBlue/90 transition shadow-sm flex items-center"
          :disabled="saving"
        >
          <svg v-if="saving" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ saving ? 'Saving...' : 'Save All Changes' }}
        </button>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex space-x-1 border-b border-gray-200 mb-6 overflow-x-auto">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        class="px-5 py-3 text-sm font-semibold whitespace-nowrap transition-colors border-b-2"
        :class="activeTab === tab.id ? 'border-royalBlue text-royalBlue' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
      >
        {{ tab.label }}
      </button>
    </div>

    <div v-if="pending" class="py-12 flex justify-center items-center">
      <div class="animate-pulse flex flex-col items-center">
        <div class="h-8 w-8 bg-gray-200 rounded-full mb-4"></div>
        <div class="h-4 w-24 bg-gray-200 rounded"></div>
      </div>
    </div>

    <div v-else class="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      
      <!-- HOME TAB -->
      <div v-if="activeTab === 'home'" class="p-6 md:p-8 space-y-8">
        <AdminHeroConfig pageKey="home" title="Home" :settings="settings" customHeroImageKey="heroImage" />
        
        <div>
          <h3 class="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Hero Text</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BaseInput v-model="settings.heroHeadline" label="Hero Headline" placeholder="Raising Spiritually Grounded Believers" class="md:col-span-2" />
            <div class="md:col-span-2">
              <label class="block text-sm font-semibold mb-1.5 text-gray-700">Hero Subheadline</label>
              <textarea v-model="settings.heroSubheadline" rows="2" class="appearance-none block w-full px-4 py-3 rounded-xl border bg-white transition-all focus:outline-none focus:ring-2 sm:text-sm shadow-sm border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-royalBlue/20 focus:border-royalBlue" placeholder="Welcome to the official digital home..."></textarea>
            </div>
          </div>
        </div>

        <div>
          <h3 class="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Mission & Vision</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-semibold mb-1.5 text-gray-700">Our Vision</label>
              <textarea v-model="settings.vision" rows="3" class="appearance-none block w-full px-4 py-3 rounded-xl border bg-white transition-all focus:outline-none focus:ring-2 sm:text-sm shadow-sm border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-royalBlue/20 focus:border-royalBlue"></textarea>
            </div>
            <div>
              <label class="block text-sm font-semibold mb-1.5 text-gray-700">Our Mission</label>
              <textarea v-model="settings.mission" rows="3" class="appearance-none block w-full px-4 py-3 rounded-xl border bg-white transition-all focus:outline-none focus:ring-2 sm:text-sm shadow-sm border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-royalBlue/20 focus:border-royalBlue"></textarea>
            </div>
          </div>
        </div>
      </div>

      <!-- ABOUT TAB -->
      <div v-if="activeTab === 'about'" class="p-6 md:p-8 space-y-10">
        <AdminHeroConfig pageKey="about" title="About" :settings="settings" />
        
        <div>
          <h3 class="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Foundation History (HTML)</h3>
          <textarea v-model="settings.about_foundationHistory" rows="5" class="appearance-none block w-full px-4 py-3 rounded-xl border bg-white transition-all focus:outline-none focus:ring-2 sm:text-sm shadow-sm border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-royalBlue/20 focus:border-royalBlue" placeholder="<p>History goes here...</p>"></textarea>
        </div>

        <div>
          <h3 class="text-lg font-bold text-gray-800 mb-4 border-b pb-2 flex justify-between items-center">
            Tenets & Mode of Worship
            <button @click="addTenet" class="text-sm font-semibold text-royalBlue flex items-center hover:underline">
              <Plus class="w-4 h-4 mr-1" /> Add Tenet
            </button>
          </h3>
          <div class="space-y-3">
            <div v-for="(tenet, index) in settings.about_tenets" :key="index" class="flex gap-3 items-start">
              <textarea v-model="settings.about_tenets[index]" rows="2" class="appearance-none block w-full px-4 py-2 rounded-xl border bg-white transition-all focus:outline-none focus:ring-2 sm:text-sm shadow-sm border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-royalBlue/20 focus:border-royalBlue flex-1" placeholder="Members are forbidden to..."></textarea>
              <button @click="settings.about_tenets.splice(index, 1)" class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors mt-1">
                <Trash2 class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div>
          <h3 class="text-lg font-bold text-gray-800 mb-4 border-b pb-2 flex justify-between items-center">
            Holy Rites & Sacraments
            <button @click="addRite" class="text-sm font-semibold text-royalBlue flex items-center hover:underline">
              <Plus class="w-4 h-4 mr-1" /> Add Rite
            </button>
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-for="(rite, index) in settings.about_rites" :key="index" class="border border-gray-200 p-4 rounded-xl relative bg-gray-50 group">
              <button @click="settings.about_rites.splice(index, 1)" class="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors opacity-0 group-hover:opacity-100">
                <Trash2 class="w-4 h-4" />
              </button>
              <div class="space-y-3 pt-2">
                <BaseInput v-model="rite.name" label="Sacrament Name" placeholder="Baptism" />
                <div>
                  <label class="block text-sm font-semibold mb-1.5 text-gray-700">Description</label>
                  <textarea v-model="rite.description" rows="2" class="appearance-none block w-full px-3 py-2 rounded-lg border bg-white transition-all focus:outline-none focus:ring-2 text-sm shadow-sm border-gray-200 text-gray-900 focus:ring-royalBlue/20 focus:border-royalBlue"></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 class="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Church Structure (HTML)</h3>
          <textarea v-model="settings.about_churchStructure" rows="4" class="appearance-none block w-full px-4 py-3 rounded-xl border bg-white transition-all focus:outline-none focus:ring-2 sm:text-sm shadow-sm border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-royalBlue/20 focus:border-royalBlue" placeholder="<p>Structure goes here...</p>"></textarea>
        </div>
      </div>

      <!-- PROGRAMS TAB -->
      <div v-if="activeTab === 'programs'" class="p-6 md:p-8 space-y-10">
        <AdminHeroConfig pageKey="programs" title="Programs" :settings="settings" />
        
        <div>
          <h3 class="text-lg font-bold text-gray-800 mb-4 border-b pb-2 flex justify-between items-center">
            Regular Prayer Days & Times
            <button @click="addRegularProgram" class="text-sm font-semibold text-royalBlue flex items-center hover:underline">
              <Plus class="w-4 h-4 mr-1" /> Add Program
            </button>
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div v-for="(prog, index) in settings.programs_regular" :key="index" class="border border-gray-200 p-4 rounded-xl relative bg-gray-50 group">
              <button @click="settings.programs_regular.splice(index, 1)" class="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors opacity-0 group-hover:opacity-100">
                <Trash2 class="w-4 h-4" />
              </button>
              <div class="space-y-3 pt-2">
                <BaseInput v-model="prog.day" label="Day" placeholder="Every Wednesday" />
                <BaseInput v-model="prog.time" label="Time" placeholder="9:00 AM & 6:00 PM" />
                <div>
                  <label class="block text-sm font-semibold mb-1.5 text-gray-700">Description</label>
                  <textarea v-model="prog.description" rows="2" class="appearance-none block w-full px-3 py-2 rounded-lg border bg-white transition-all focus:outline-none focus:ring-2 text-sm shadow-sm border-gray-200 text-gray-900 focus:ring-royalBlue/20 focus:border-royalBlue"></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 class="text-lg font-bold text-gray-800 mb-4 border-b pb-2 flex justify-between items-center">
            Annual Feasts & Special Services
            <button @click="addAnnualProgram" class="text-sm font-semibold text-royalBlue flex items-center hover:underline">
              <Plus class="w-4 h-4 mr-1" /> Add Feast
            </button>
          </h3>
          <div class="space-y-4">
            <div v-for="(feast, index) in settings.programs_annual" :key="index" class="border border-gray-200 p-4 rounded-xl flex flex-col md:flex-row gap-4 items-start relative group bg-white">
              <button @click="settings.programs_annual.splice(index, 1)" class="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors md:opacity-0 group-hover:opacity-100">
                <Trash2 class="w-4 h-4" />
              </button>
              <div class="w-full md:w-1/4">
                <BaseInput v-model="feast.month" label="Month Label" placeholder="January" />
              </div>
              <div class="w-full md:w-3/4 space-y-3 pr-6">
                <BaseInput v-model="feast.title" label="Title" placeholder="New Year Thanksgiving" />
                <div>
                  <label class="block text-sm font-semibold mb-1.5 text-gray-700">Description</label>
                  <textarea v-model="feast.description" rows="2" class="appearance-none block w-full px-3 py-2 rounded-lg border bg-white transition-all focus:outline-none focus:ring-2 text-sm shadow-sm border-gray-200 text-gray-900 focus:ring-royalBlue/20 focus:border-royalBlue"></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- LEADERSHIP TAB -->
      <div v-if="activeTab === 'leadership'" class="p-6 md:p-8 space-y-10">
        <AdminHeroConfig pageKey="leadership" title="Leadership" :settings="settings" />
        
        <div>
          <h3 class="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Leadership Ranks Definitions</h3>
          <p class="text-sm text-gray-500 mb-6">These are the static definitions and rules for leadership roles (the text shown at the top of the Leadership page). To manage actual leadership personnel, use the "Leadership" menu item in the sidebar.</p>
          
          <div class="space-y-8">
            <div>
              <div class="flex justify-between items-center mb-3">
                <label class="block text-sm font-semibold text-gray-700">Male Leadership Line</label>
                <button @click="addLeadershipLine('male')" class="text-xs font-semibold text-royalBlue hover:underline">Add Rank</button>
              </div>
              <div class="space-y-2">
                <div v-for="(item, idx) in settings.leadership_male" :key="'m'+idx" class="flex gap-2">
                  <BaseInput v-model="item.rank" placeholder="Rank (e.g. Brother)" class="w-1/3" />
                  <BaseInput v-model="item.description" placeholder="Description (e.g. Brother Sultana)" class="flex-1" />
                  <button @click="settings.leadership_male.splice(idx, 1)" class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition mt-1"><Trash2 class="w-5 h-5"/></button>
                </div>
              </div>
            </div>

            <div>
              <div class="flex justify-between items-center mb-3">
                <label class="block text-sm font-semibold text-gray-700">Female Leadership Line</label>
                <button @click="addLeadershipLine('female')" class="text-xs font-semibold text-royalBlue hover:underline">Add Rank</button>
              </div>
              <div class="space-y-2">
                <div v-for="(item, idx) in settings.leadership_female" :key="'f'+idx" class="flex gap-2">
                  <BaseInput v-model="item.rank" placeholder="Rank (e.g. Sister)" class="w-1/3" />
                  <BaseInput v-model="item.description" placeholder="Description" class="flex-1" />
                  <button @click="settings.leadership_female.splice(idx, 1)" class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition mt-1"><Trash2 class="w-5 h-5"/></button>
                </div>
              </div>
            </div>

            <div>
              <div class="flex justify-between items-center mb-3">
                <label class="block text-sm font-semibold text-gray-700">Prophets & Prophetesses Line</label>
                <button @click="addLeadershipLine('prophets')" class="text-xs font-semibold text-royalBlue hover:underline">Add Rank</button>
              </div>
              <div class="space-y-2">
                <div v-for="(item, idx) in settings.leadership_prophets" :key="'p'+idx" class="flex gap-2">
                  <BaseSelect v-model="item.category" :options="[{label:'Prophet', value:'Prophet'}, {label:'Prophetess', value:'Prophetess'}]" class="w-1/4" />
                  <BaseInput v-model="item.rank" placeholder="Rank" class="w-1/4" />
                  <BaseInput v-model="item.description" placeholder="Description" class="flex-1" />
                  <button @click="settings.leadership_prophets.splice(idx, 1)" class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition mt-1"><Trash2 class="w-5 h-5"/></button>
                </div>
              </div>
            </div>

            <div>
              <div class="flex justify-between items-center mb-3">
                <label class="block text-sm font-semibold text-gray-700">Functions of Ranks</label>
                <button @click="addFunction" class="text-xs font-semibold text-royalBlue hover:underline">Add Function</button>
              </div>
              <div class="space-y-2">
                <div v-for="(item, idx) in settings.leadership_functions" :key="'fn'+idx" class="flex gap-2 items-center">
                  <span class="text-gray-400 font-bold w-6 text-right">{{ idx + 1 }}.</span>
                  <BaseInput v-model="settings.leadership_functions[idx]" placeholder="Function description" class="flex-1" />
                  <button @click="settings.leadership_functions.splice(idx, 1)" class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition mt-1"><Trash2 class="w-5 h-5"/></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- WORSHIP TAB -->
      <div v-if="activeTab === 'worship'" class="p-6 md:p-8 space-y-10">
        <AdminHeroConfig pageKey="worship" title="Worship" :settings="settings" />
        
        <div>
          <h3 class="text-lg font-bold text-gray-800 mb-4 border-b pb-2 flex justify-between items-center">
            Order of Services
            <button @click="addWorshipService" class="text-sm font-semibold text-royalBlue flex items-center hover:underline">
              <Plus class="w-4 h-4 mr-1" /> Add Service
            </button>
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-for="(svc, index) in settings.worship_services" :key="index" class="border border-gray-200 p-4 rounded-xl relative bg-gray-50 group">
              <button @click="settings.worship_services.splice(index, 1)" class="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors opacity-0 group-hover:opacity-100">
                <Trash2 class="w-4 h-4" />
              </button>
              <div class="space-y-3 pt-2">
                <BaseInput v-model="svc.title" label="Service Title" placeholder="Order of Morning Service" />
                <BaseInput v-model="svc.subtitle" label="Schedule / Subtitle" placeholder="Daily at 6:00 AM" />
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 class="text-lg font-bold text-gray-800 mb-4 border-b pb-2 flex justify-between items-center">
            Sacred Hymns
            <button @click="addWorshipHymn" class="text-sm font-semibold text-royalBlue flex items-center hover:underline">
              <Plus class="w-4 h-4 mr-1" /> Add Hymn
            </button>
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-for="(hymn, index) in settings.worship_hymns" :key="index" class="border border-gray-200 p-4 rounded-xl relative bg-white group">
              <button @click="settings.worship_hymns.splice(index, 1)" class="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors opacity-0 group-hover:opacity-100">
                <Trash2 class="w-4 h-4" />
              </button>
              <div class="space-y-3 pt-2">
                <BaseInput v-model="hymn.title" label="Hymn Title" placeholder="Hymn 1 (Processional)" />
                <BaseInput v-model="hymn.category" label="Category / Language" placeholder="Yoruba / English" />
                <div>
                  <label class="block text-sm font-semibold mb-1.5 text-gray-700">Lyrics Snippet</label>
                  <textarea v-model="hymn.lyrics" rows="3" class="appearance-none block w-full px-3 py-2 rounded-lg border bg-white transition-all focus:outline-none focus:ring-2 text-sm shadow-sm border-gray-200 text-gray-900 focus:ring-royalBlue/20 focus:border-royalBlue"></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- SERMONS TAB -->
      <div v-if="activeTab === 'sermons'" class="p-6 md:p-8 space-y-10">
        <AdminHeroConfig pageKey="sermons" title="Sermons" :settings="settings" />
        
        <div>
          <h3 class="text-lg font-bold text-gray-800 mb-4 border-b pb-2 flex justify-between items-center">
            Resources & Downloads
            <button @click="addSermonResource" class="text-sm font-semibold text-royalBlue flex items-center hover:underline">
              <Plus class="w-4 h-4 mr-1" /> Add Resource
            </button>
          </h3>
          <div class="space-y-3">
            <div v-for="(res, index) in settings.sermons_resources" :key="index" class="flex gap-3 items-center">
              <BaseInput v-model="res.title" placeholder="Resource Title" class="w-2/3" />
              <button @click="settings.sermons_resources.splice(index, 1)" class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                <Trash2 class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- BLOG TAB -->
      <div v-if="activeTab === 'blog'" class="p-6 md:p-8 space-y-10">
        <AdminHeroConfig pageKey="blog" title="Blog" :settings="settings" />
        
        <div>
          <h3 class="text-lg font-bold text-gray-800 mb-4 border-b pb-2 flex justify-between items-center">
            Blog Categories
            <button @click="addBlogCategory" class="text-sm font-semibold text-royalBlue flex items-center hover:underline">
              <Plus class="w-4 h-4 mr-1" /> Add Category
            </button>
          </h3>
          <div class="flex flex-wrap gap-3">
            <div v-for="(cat, index) in settings.blog_categories" :key="index" class="flex items-center bg-gray-100 rounded-full pl-4 pr-1 py-1">
              <input v-model="settings.blog_categories[index]" type="text" class="bg-transparent border-none outline-none text-sm font-semibold text-gray-700 w-32 focus:ring-0 p-0" />
              <button @click="settings.blog_categories.splice(index, 1)" class="p-1.5 text-gray-400 hover:text-red-500 rounded-full transition-colors ml-2">
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ALUMNI TAB -->
      <div v-if="activeTab === 'alumni'" class="p-6 md:p-8 space-y-10">
        <AdminHeroConfig pageKey="alumni" title="Alumni" :settings="settings" />
        
        <div>
          <h3 class="text-lg font-bold text-gray-800 mb-4 border-b pb-2 flex justify-between items-center">
            Alumni Testimonials
            <button @click="addAlumniTestimonial" class="text-sm font-semibold text-royalBlue flex items-center hover:underline">
              <Plus class="w-4 h-4 mr-1" /> Add Testimonial
            </button>
          </h3>
          <div class="grid grid-cols-1 gap-4">
            <div v-for="(test, index) in settings.alumni_testimonials" :key="index" class="border border-gray-200 p-4 rounded-xl relative bg-gray-50 group">
              <button @click="settings.alumni_testimonials.splice(index, 1)" class="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors opacity-0 group-hover:opacity-100">
                <Trash2 class="w-4 h-4" />
              </button>
              <div class="space-y-3 pt-2">
                <BaseInput v-model="test.author" label="Author / Class" placeholder="- Dr. Anonymous (Class of '15)" />
                <div>
                  <label class="block text-sm font-semibold mb-1.5 text-gray-700">Quote</label>
                  <textarea v-model="test.quote" rows="3" class="appearance-none block w-full px-3 py-2 rounded-lg border bg-white transition-all focus:outline-none focus:ring-2 text-sm shadow-sm border-gray-200 text-gray-900 focus:ring-royalBlue/20 focus:border-royalBlue"></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- CONTACT TAB -->
      <div v-if="activeTab === 'contact'" class="p-6 md:p-8 space-y-10">
        <AdminHeroConfig pageKey="contact" title="Contact" :settings="settings" />
        
        <div>
          <h3 class="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Fellowship Location Details</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="md:col-span-2">
              <label class="block text-sm font-semibold mb-1.5 text-gray-700">Address (Multi-line)</label>
              <textarea v-model="settings.contact_location.address" rows="3" class="appearance-none block w-full px-4 py-3 rounded-xl border bg-white transition-all focus:outline-none focus:ring-2 sm:text-sm shadow-sm border-gray-200 text-gray-900 focus:ring-royalBlue/20 focus:border-royalBlue"></textarea>
            </div>
            <BaseInput v-model="settings.contact_location.email" label="Email Address" />
            <BaseInput v-model="settings.contact_location.whatsapp" label="WhatsApp Number" />
          </div>
        </div>

        <div>
          <h3 class="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Partner With Us</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-semibold mb-1.5 text-gray-700">Partnership Text</label>
              <textarea v-model="settings.contact_partnership" rows="3" class="appearance-none block w-full px-4 py-3 rounded-xl border bg-white transition-all focus:outline-none focus:ring-2 sm:text-sm shadow-sm border-gray-200 text-gray-900 focus:ring-royalBlue/20 focus:border-royalBlue"></textarea>
            </div>
            <FileUpload v-model="settings.contact_partnershipLink" label="Sponsorship Proposal (PDF)" />
          </div>
        </div>
      </div>

      <!-- DEPARTMENTS TAB -->
      <div v-if="activeTab === 'departments'" class="p-6 md:p-8 space-y-10">
        <AdminHeroConfig pageKey="departments" title="Departments" :settings="settings" />
      </div>

      <!-- GALLERY TAB -->
      <div v-if="activeTab === 'gallery'" class="p-6 md:p-8 space-y-10">
        <AdminHeroConfig pageKey="gallery" title="Gallery" :settings="settings" />
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Plus, Trash2 } from 'lucide-vue-next'
import { useToast } from '#imports'

const { useSettingsApi, updateSetting } = useApi()
const { showToast } = useToast()

const activeTab = ref('home')
const tabs = [
  { id: 'home', label: 'Home Page' },
  { id: 'about', label: 'About Page' },
  { id: 'programs', label: 'Programs' },
  { id: 'leadership', label: 'Leadership' },
  { id: 'worship', label: 'Worship' },
  { id: 'sermons', label: 'Sermons' },
  { id: 'blog', label: 'Blog' },
  { id: 'alumni', label: 'Alumni' },
  { id: 'contact', label: 'Contact' },
  { id: 'departments', label: 'Departments' },
  { id: 'gallery', label: 'Gallery' }
]

const pending = ref(true)
const saving = ref(false)

// Default empty structures
const settings = ref<Record<string, any>>({
  heroHeadline: '',
  heroSubheadline: '',
  heroImage: '',
  vision: '',
  mission: '',
  about_foundationHistory: '',
  about_tenets: [],
  about_rites: [],
  about_churchStructure: '',
  programs_regular: [],
  programs_annual: [],
  leadership_male: [],
  leadership_female: [],
  leadership_prophets: [],
  leadership_functions: [],
  worship_services: [],
  worship_hymns: [],
  sermons_resources: [],
  blog_categories: [],
  alumni_testimonials: [],
  contact_location: { address: '', email: '', whatsapp: '' },
  contact_partnership: '',
  contact_partnershipLink: ''
})

// Keys will be dynamically handled to support new keys
onMounted(async () => {
  try {
    const rawSettings = await useSettingsApi()
    // Populate the refs with data from DB if exists
    Object.keys(rawSettings).forEach(key => {
      settings.value[key] = rawSettings[key]
    })
  } catch (err) {
    showToast('Failed to load settings', 'error')
  } finally {
    pending.value = false
  }
})

const saveAll = async () => {
  saving.value = true
  try {
    const currentKeys = Object.keys(settings.value)
    for (const key of currentKeys) {
      await updateSetting(key, settings.value[key])
    }
    showToast('Content updated successfully!', 'success')
  } catch (err) {
    showToast('Failed to save some content', 'error')
  } finally {
    saving.value = false
  }
}

// Helpers for arrays
const addTenet = () => settings.value.about_tenets.push('')
const addRite = () => settings.value.about_rites.push({ name: '', description: '' })
const addRegularProgram = () => settings.value.programs_regular.push({ day: '', time: '', description: '' })
const addAnnualProgram = () => settings.value.programs_annual.push({ month: '', title: '', description: '' })
const addLeadershipLine = (line: string) => {
  if (line === 'prophets') {
    settings.value[`leadership_${line}`].push({ category: 'Prophet', rank: '', description: '' })
  } else {
    settings.value[`leadership_${line}`].push({ rank: '', description: '' })
  }
}
const addFunction = () => settings.value.leadership_functions.push('')
const addWorshipService = () => settings.value.worship_services.push({ title: '', subtitle: '' })
const addWorshipHymn = () => settings.value.worship_hymns.push({ title: '', category: '', lyrics: '' })
const addSermonResource = () => settings.value.sermons_resources.push({ title: '' })
const addBlogCategory = () => settings.value.blog_categories.push('New Category')
const addAlumniTestimonial = () => settings.value.alumni_testimonials.push({ quote: '', author: '' })
</script>
