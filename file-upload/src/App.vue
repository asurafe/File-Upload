<template>
  <div class="content">
    <FileUpload/>
  </div>
</template>
<script>
import FileUpload from './components/FileUpload.vue'
  export default {
    components:{
      FileUpload,
    }
  }
</script>

<style lang="scss" scoped>
.content{
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  
}
</style>