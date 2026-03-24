<template>
  <div class="register">
    <div class="register__container">
      <div class="register__card">
        <UiMascot/>

        <div class="register__content">
          <span class="register__title">
            Создать аккаунт
          </span>

          <span class="register__subtitle">
            Присоединяйтесь к нашему пространству!
          </span>

          <UiInput
              v-model="nickname"
              type="nickname"
              label="Никнейм"
              placeholder="noob_master#1337"
          />
          <UiInput
              v-model="email"
              label="Электронная почта"
              placeholder="pressf@respawn.gg"
              type="email"
          />
          <UiInput
              v-model="password"
              label="Пароль"
              placeholder="EZ4ME_2026!"
              type="password"
          />

          <ui-button
              full-width
              label="Создать аккаунт"
              native-type="submit"
          />

          <ui-divider label="или"/>

          <span class="register__login">
            Уже есть аккаунт?
            <ui-link
                label="Войти"
                to="/login"
            />
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import UiMascot from "~/components/ui/ui-mascot/ui-mascot.vue";
import UiInput from "~/components/ui/ui-input/ui-input.vue";
import UiLink from "~/components/ui/ui-link/ui-link.vue";
import UiDivider from "~/components/ui/ui-divider/ui-divider.vue";
import UiButton from "~/components/ui/ui-button/ui-button.vue";

useHead({
  title: 'Регистрация — Surik',
});

const email = ref('');
const password = ref('');
const nickname = ref('');
</script>

<style scoped lang="scss" src="./index.scss" />