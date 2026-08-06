<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-2xl font-display font-bold text-gray-800">Gallery Management</h2>
        <p class="text-gray-500 text-sm">Upload and organize photos into albums.</p>
      </div>
      <button class="bg-royalBlue text-white px-4 py-2 rounded-lg font-medium hover:bg-skyBlue transition flex items-center">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
        Create Album
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition group">
        <div class="h-40 bg-gray-200 relative">
          <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span class="text-white font-medium">Manage Photos</span>
          </div>
        </div>
        <div class="p-4 flex justify-between items-center">
          <div>
            <h3 class="font-bold text-gray-800">Worship Service</h3>
            <p class="text-xs text-gray-500">24 Photos</p>
          </div>
          <button class="text-gray-400 hover:text-red-500 transition">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
