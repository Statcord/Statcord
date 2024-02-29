<template>
  <div class="footer">
    <div class="container">
      <div class="row">
        <div class="l6 s6">
          <ul>
            <li>
              <img src="/img/logo.png" loading="lazy" alt="Statcord logo" style="max-width: 40%;">
            </li>
            <li>
              <span class="left">© {{year}} <a href="https://numselli.xyz" target="_blank" rel="noopener noreferrer" class="underline">numselli</a></span>
            </li>
          </ul>
        </div>
        <div class="l4 offset-l8 s6">
          <h6><router-link to="/partners" class="underline">Partners</router-link></h6>
          <ul>
            <li>
              <a href="https://safeguardhosting.ca/aff.php?aff=17&src=statcord" target="_blank" rel="noopener noreferrer">
                <img src="/img/partners/SafeGuard/SafeGuard_logo_text_right.svg" alt="SafeGuard hosting logo" loading="lazy" style="max-width: 60%;">
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'footerbar',
    data(){
      return {
        year: new Date().getFullYear()
      }
    }
  }
</script>
<style>
  .footer {
    color: #ffffff;
    background-color: #006495;
  }
  .footer a {
    color: #ffffff;
  }
  .footer{
    overflow: hidden;
    min-height: 50px;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
        -ms-flex-align: center;
            align-items: center;
    -webkit-box-pack: justify;
    -webkit-justify-content: space-between;
        -ms-flex-pack: justify;
            justify-content: space-between;
    padding: 10px 0px;
    color: #ffffff;
    background-color: #006495;
  }
  .footer ul {
    padding-left: 0;
    list-style-type: none;
  }
</style>