<script setup lang="ts">
import { Authenticator } from "@aws-amplify/ui-vue";
import "@aws-amplify/ui-vue/styles.css";
import { useRouter } from 'vue-router';

const router = useRouter();
</script>
<! Amplify Docs https://docs.amplify.aws/javascript/start/quickstart/ >
<! Components docs https://ui.docs.amplify.aws/vue/connected-components/authenticator/configuration>
<template>
  <main>
    <authenticator :hide-sign-up="true"> <! Disable Signup >
      <template v-slot="{ user, signOut }">
        <p>
            <strong>Current route path:</strong> {{ $route.fullPath }}
        </p>
        <h1>Hello {{user?.signInDetails?.loginId}}'s todos</h1>
        <nav>
          <router-link to="/">Home</router-link> |
          <router-link to="/hello">Say Hello</router-link>
        </nav>
        <router-view />
        <button @click="signOut">Sign Out</button>
      </template>
    </authenticator>
  </main>
</template>
