
<template>
    <svg :class="iconClass">
      <!-- Replace with your SVG content -->
      <path class="cls-1" d="m396.5,196.5h-158c-19.33,0-35-15.67-35-35V3.5c0-1.93-1.57-3.5-3.5-3.5h0c-1.93,0-3.5,1.57-3.5,3.5v158c0,19.33-15.67,35-35,35H3.5c-1.93,0-3.5,1.57-3.5,3.5h0c0,1.93,1.57,3.5,3.5,3.5h158c19.33,0,35,15.67,35,35v158c0,1.93,1.57,3.5,3.5,3.5h0c1.93,0,3.5-1.57,3.5-3.5v-158c0-19.33,15.67-35,35-35h158c1.93,0,3.5-1.57,3.5-3.5h0c0-1.93-1.57-3.5-3.5-3.5Z"/>
    </svg>
  </template>
  
  <script>
  export default {
    props: {
      iconClass: {
        type: String,
        required: true
      }
    }
  };
  </script>
  
  <style scoped>
  .cls-1 {
    fill: #000;
    stroke-width: 0px;
    width: 20px;
    height: 20px;
  }

  </style>
  