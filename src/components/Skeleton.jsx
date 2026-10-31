import React from 'react'

const Skeleton = () => {
  return (
     
<div class="animate-pulse flex flex-col items-center gap-4 w-full">
  <div>
    <div class="w-48 h-2 bg-slate-400 rounded-md"></div>
    <div class="w-28 h-2 bg-slate-400 mx-auto mt-3 rounded-md"></div>
  </div>
  <div class="h-2 bg-slate-400 w-full rounded-md"></div>
  <div class="h-2 bg-slate-400 w-full rounded-md"></div>
  <div class="h-2 bg-slate-400 w-full rounded-md"></div>
  <div class="h-2 bg-slate-400 w-1/2 rounded-md"></div>
</div>
  )
}

export default Skeleton