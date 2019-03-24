<template>
  <v-app>
    <v-toolbar dense>
      <v-toolbar-title class="ml-0 pl-3">
        <v-toolbar-side-icon @click.stop="sideBar = !sideBar"></v-toolbar-side-icon>
      </v-toolbar-title>
      <v-text-field solo flat prepend-inner-icon="search"></v-text-field>
      <v-spacer></v-spacer>
      <v-btn @click.stop="dialog()" flat>Login</v-btn>
    </v-toolbar>
      <v-img :src="require('@/assets/pulp-fiction.jpg')" class = "ma-5" gradient="to top right, rgba(100,115,201,.33), rgba(25,32,72,.7)">
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
                <span >{{movies[j-1].title}}</span>
              </div>
              </v-layout>
          </v-flex>
        </v-layout>
        <v-layout align-center justify-center>
          <v-btn @click="manual()">Load More</v-btn>
        </v-layout>
      </v-layout>
    </v-container>

    <v-dialog v-model="movieDialog" width="35%">
      <v-container>
        <v-layout column>
          <v-img contain height="400px" @click="movieDia(j-1)" :src="`http://image.tmdb.org/t/p/w500/${movieUrl()}`" ></v-img>
          <v-card>
            <v-rating v-model="currentMovieRating" length="10" hover></v-rating>
            <span>{{currentMovieDistant}}</span>
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
        currentMovieDistance: null,
        currentPage: 1,
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
    },
    mounted(){
      this.scroll();
    },
    methods:{
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
          this.currentMovieDistance = result.data.data;
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
            userRating: this.currentMovieRating,
            username: this.$store.state.username
          }),
        {
          headers: { "Content-type": "application/json" }
        })
        .then(result => {
          console.log("work");
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
        // axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=ce54eab5f21943ef32228205704ddaf4&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=2`)
        // .then(result => {
        //   let movie = result.data.results;
        //   for(let i =0;i<movie.length;i++){
        //     this.movies.push(movie[i]);
        //   }
        //   console.log(result.data);
        // }).catch(error => {
        //   console.log(error)
        // });
        // axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=ce54eab5f21943ef32228205704ddaf4&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=3`)
        // .then(result => {
        //   let movie = result.data.results;
        //   for(let i =0;i<movie.length;i++){
        //     this.movies.push(movie[i]);
        //   }
        //   console.log(result.data);
        // }).catch(error => {
        //   console.log(error)
        // });
        // axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=ce54eab5f21943ef32228205704ddaf4&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=4`)
        // .then(result => {
        //   let movie = result.data.results;
        //   for(let i =0;i<movie.length;i++){
        //     this.movies.push(movie[i]);
        //   }
        //   console.log(result.data);
        // }).catch(error => {
        //   console.log(error)
        // });
        // axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=ce54eab5f21943ef32228205704ddaf4&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=5`)
        // .then(result => {
        //   let movie = result.data.results;
        //   for(let i =0;i<movie.length;i++){
        //     this.movies.push(movie[i]);
        //   }
        //   console.log(result.data);
        // }).catch(error => {
        //   console.log(error)
        // });
      },
      dialog(){
        this.loginDialog = true;
      },
      movieDia(movie){
        this.movieDialog =true;
        this.currentMovie = movie;
        this.movieDistance();
      },
      signUp(){
        if(!this.signup){
          this.signup = true;
        }else if(this.signup){
          //send account info
          if (this.$refs.signUpForm.validate()) {
            this.$store.commit("setUser",this.username);
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
