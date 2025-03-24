<script setup lang="ts">
import '@/assets/main.css';
import { onMounted, ref } from 'vue';
import type { Schema } from '../../amplify/data/resource';
import { generateClient } from 'aws-amplify/data';

const client = generateClient<Schema>();
// call python function
const helloResponse = ref<string>();
const nameInput = ref(''); // Add this to store the input value

async function sayhello() {
  // Use the name from the input, or fallback to 'Guest' if empty
  const name = nameInput.value.trim() || 'Guest';
  const { data, errors } = await client.queries.sayHello({
    name: name
  });

  if (data) {
    helloResponse.value = data;
  } else if (errors) {
    helloResponse.value = 'Error: ' + errors[0].message;
  }
}

</script>

<template>
    <div>
        <h2>Say Hello Page</h2>

        <div class="input-container">
            <label for="name-input">Your Name:</label>
            <input
                id="name-input"
                v-model="nameInput"
                type="text"
                placeholder="Enter your name"
                @keyup.enter="sayhello"
            />
        </div>

        <button @click="sayhello">Say Hello</button>

        <div v-if="helloResponse" class="hello-response">
            {{ helloResponse }}
        </div>
    </div>
</template>

<style scoped>
.hello-response {
  margin-top: 15px;
  padding: 10px;
  background-color: #f0f0f0;
  border-radius: 5px;
  font-weight: bold;
}

.input-container {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

input {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  width: 100%;
  max-width: 300px;
  margin-bottom: 10px;
}

input:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
}
</style>
