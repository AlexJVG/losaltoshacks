<template id="app">
  <v-app dark>
    <v-toolbar dense>
      <v-toolbar-title class="ml-0 pl-3">
        <!-- <v-toolbar-side-icon @click.stop="sideBar = !sideBar"></v-toolbar-side-icon> -->
        <v-avatar><img :src="require('@/assets/test.png')"></v-avatar>
      </v-toolbar-title>
      <!-- <v-text-field solo flat prepend-inner-icon="search"></v-text-field> -->
      <v-spacer></v-spacer>
      <v-btn v-if="!loggedIn" @click.stop="dialog()" flat>Login</v-btn>
      <span v-if="loggedIn">{{this.$store.state.username}}</span>
      <v-btn v-if="loggedIn" @click.stop="logout()" flat>Log Out</v-btn>
    </v-toolbar>
      <v-img :src="require('@/assets/pulp-fiction.jpg')" class = "ma-5 elevation-24" gradient="to top right, rgba(100,115,201,.33), rgba(25,32,72,.7)">
     <v-layout row wrap align-center>
                <v-flex class="text-xs-center " style="padding-top: 15%">
                  <h3 class="display-3 white--text">MovieMe</h3>
                  <span class="subheading white--text">CUSTUM MOVIE RATINGS BY THE PEOPLE, FOR THE PEOPLE </span>
                </v-flex>
              </v-layout>
    </v-img>


    <v-container grid-list-xl fluid>
        <v-layout row wrap>
          <v-flex v-for="j in moviesLength" xs3 class = "pa-4">
            <v-hover>
              <v-img slot-scope="{ hover }" :class="`elevation-${hover ? 24 : 2}`" style="
                padding-top: 30px;
                padding-right: 30px;
                padding-bottom: 30px;
                padding-left: 30px;

              " @click="movieDia(j-1)":src="`http://image.tmdb.org/t/p/w500/${movies[j-1].poster_path}`"></v-img>
            </v-hover>
              <v-layout align-center justify-center>
              <div class="mt-2">
                <span style="font-size:12pt">{{movies[j-1].title}}</span>
              </div>
              </v-layout>
          </v-flex>
        </v-layout>
        <v-layout align-center justify-center>
          <v-btn @click="manual()">Load More</v-btn>
        </v-layout>
      </v-layout>
    </v-container>

    <v-dialog v-model="movieDialog" width="57%">
      <v-container>
        <v-layout rows>
          <v-img contain height="600px" @click="movieDia(j-1)" :src="`http://image.tmdb.org/t/p/w500/${movieUrl()}`" ></v-img>
          <v-card width='50%'>
            <v-card-title class="headline">{{movies[currentMovie].title}}</v-card-title>
            <v-chip v-for="item in genres" :key="item.id">{{show(item.name)}}</v-chip>
            <v-card-text>{{movies[currentMovie].overview}}</v-card-text>
            <v-progress-circular :rotate="90" :size="100" color="primary" :width="15" :value="Number((currentMovieDistant).toFixed(2))">{{ Number((currentMovieDistant).toFixed(2)) }}</v-progress-circular>
            <v-rating v-model="currentMovieRating" half-increments length="5" hover></v-rating>
            <v-card-actions>
              <v-btn @click.stop="ratingData()">Rate</v-btn>
            </v-card-actions>
          </v-card>
        </v-layout>
      </v-container>
    </v-dialog>

    <v-dialog v-model="loginDialog" max-width="500">
      <v-card>
        <!-- Login section -->
        <section v-if="signup">
          <v-content>
            <v-form ref="signUpForm">
              <v-container xs12>
                <v-card-title primary-title class="headline">Sign Up</v-card-title>
                <v-text-field label="Email" v-model="username" :rules="[rules.required]"></v-text-field>
                <v-text-field label="Password" :type="'password'" v-model="password" :rules="[rules.required]"></v-text-field>
                <v-text-field label="Reenter Password" :type="'password'" :rules="[rules.required,rules.password]"></v-text-field>
                <v-card-actions class="justify-center">
                  <v-btn @click.stop="login()">Login</v-btn>
                  <v-btn @click.stop="signUp()">Sign Up</v-btn>
                </v-card-actions>
              </v-container>
            </v-form>
          </v-content>
        </section>

        <!-- Sign up Section -->
        <section v-if="!signup">
          <v-content>
            <v-form ref="loginForm">
              <v-container xs12>
                <v-card-title primary-title class="headline">Login</v-card-title>
                <v-text-field label="Email" v-model="username" :rules="[rules.required]"></v-text-field>
                <v-text-field label="Password" :type="'password'" v-model="password"></v-text-field>
                <v-card-actions class="justify-center">
                  <v-btn @click.stop="login()">Login</v-btn>
                  <v-btn @click.stop="signUp()">Sign Up</v-btn>
                </v-card-actions>
              </v-container>
            </v-form>
          </v-content>
        </section>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
  import {server,api} from "@/constants";
  import axios from "axios";
  export default {
    name: "MainPage",
    data(){
      return {
        loginDialog: false,
        movieDialog: false,
        signup: false,
        username: "",
        password: "",
        sideBar: false,
        rules: {
          required: v => !!v || "Required",
          password: v => (v==this.password) || "Passwords must be equal",
          email: v=>{
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return pattern.test(v) || "Invalid E-Mail";
          }
        },
        movies:[],
        currentMovie: 0,
        currentMovieRating: 1,
        currentMovieDistance: 0,
        currentPage: 1,
        loggedIn: false,
        genres:[]
      }
    },
    components: {
    },
    computed:{
      moviesLength(){
        return this.movies.length;
      },
      currentMovieDistant(){
        return this.currentMovieDistance;
      }
    },
    created(){
      this.loadMovies();
      if(!(this.$store.state.username=="")){
        this.loggedIn = true;
      }
    },
    mounted(){
      this.scroll();
    },
    methods:{
      show(thing){
        console.log(thing);
        return thing;
      },
      genreName(movieId){
        axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=ce54eab5f21943ef32228205704ddaf4`)
        .then(result => {
          console.log(result.data.genres);
          this.genres=result.data.genres;
        }).catch(error => {
          console.log(error)
        });
      },
      logout(){
        this.$store.commit("setUser","");
        this.loggedIn = false;
      },
      scroll(){
        window.onscroll = () => {
        console.log('please')
        let bottomOfWindow = (document.documentElement.scrollTop||document.body.scrollTop) + window.innerHeight === document.documentElement.offsetHeight;

        if (bottomOfWindow) {
          console.log("please2")
          this.currentPage++;
          axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=ce54eab5f21943ef32228205704ddaf4&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${this.currentPage}`)
          .then(result => {
            let movie = result.data.results;
            for(let i =0;i<movie.length;i++){
              this.movies.push(movie[i]);
            }
            console.log(result.data);
          }).catch(error => {
            console.log(error)
          });
        }
        };
      },
      manual(){
        this.currentPage++;
        axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=ce54eab5f21943ef32228205704ddaf4&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${this.currentPage}`)
        .then(result => {
          let movie = result.data.results;
          for(let i =0;i<movie.length;i++){
            this.movies.push(movie[i]);
          }
          console.log(result.data);
        }).catch(error => {
          console.log(error)
        });
      },
      movieDistance(){
        axios.post(`http://${server}/api/personal-rating`,
          JSON.stringify({
            movieId: this.movies[this.currentMovie].id,
            username: this.$store.state.username
          }),
        {
          headers: { "Content-type": "application/json" }
        })
        .then(result => {
          console.log("work");
          console.log(result.data);
          if (result.data.data == null || result.data.data == "idk"){
            this.currentMovieDistance = 0;
            axios.get(`https://api.themoviedb.org/3/movie/${this.movies[this.currentMovie].id}?api_key=ce54eab5f21943ef32228205704ddaf4`)
            .then(result => {
              console.log("average");
              console.log(result.data.vote_average);
              this.currentMovieDistance=result.data.vote_average*10;
            }).catch(error => {
              console.log(error)
            });
          }else{
            this.currentMovieDistance = result.data.data;
          }
        }).catch(error => {
          console.log(error)
        });
      },
      ratingData(){
        console.log("running");
        axios.post(`http://${server}/api/rate-movie`,
          JSON.stringify({
            movieId: this.movies[this.currentMovie].id,
            genres: this.movies[this.currentMovie].genre_ids,
            databaseRating: this.movies[this.currentMovie].vote_average,
            userRating: this.currentMovieRating*2,
            username: this.$store.state.username
          }),
        {
          headers: { "Content-type": "application/json" }
        })
        .then(result => {
          console.log("work");
          this.currentMovieRating=.5;
          this.movieDialog = false;
        }).catch(error => {
          console.log(error)
        });
      },
      movieUrl(){
        return this.movies[this.currentMovie].poster_path;
      },
      loadMovies(){
        axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=ce54eab5f21943ef32228205704ddaf4&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1`)
        .then(result => {
          let movie = result.data.results;
          for(let i =0;i<movie.length;i++){
            this.movies.push(movie[i]);
          }
          console.log(result.data);
        }).catch(error => {
          console.log(error)
        });
      },
      dialog(){
        this.loginDialog = true;
      },
      movieDia(movie){
        this.movieDialog =true;
        this.currentMovie = movie;
        this.genreName(this.movies[this.currentMovie].id)
        this.movieDistance();
      },
      signUp(){
        if(!this.signup){
          this.signup = true;
        }else if(this.signup){
          //send account info
          if (this.$refs.signUpForm.validate()) {
            this.$store.commit("setUser",this.username);
            this.loggedIn=true;
            axios.post(`http://${server}/api/create-account`,
              JSON.stringify({
                username: this.username,
                password: this.password
              }),
            {
              headers: { "Content-type": "application/json" }
            })
            .then(result => {
              console.log(result.data);
              this.loginDialog=false;
            }).catch(error => {
              console.log(error)
            });
          }
        }
      },
      login(){
        if(this.signup){
          this.signup = false;
        }else if(!this.signup){
          if (this.$refs.loginForm.validate()) {
            axios.post(`http://${server}/api/account-info`,
              JSON.stringify({
                username: this.username,
              }),
            {
              headers: { "Content-type": "application/json" }
            })
            .then(result => {
              console.log(result.data);
              if(result.data.data){
                this.$store.commit("setUser",this.username);
                this.loggedIn=true;
                this.loginDialog=false;
              }else{

              }
            }).catch(error => {
              console.log(error)
            });
          }
        }
      }
    }
  }
</script>
<style>
  @import url('https://fonts.googleapis.com/css?family=Exo+2');
  #app{
    font-family: 'Exo 2', sans-serif;
  }

</style>