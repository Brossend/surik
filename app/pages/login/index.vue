<template>
  <div class="login">
    <div class="login__container">
      <div class="login__card">
        <UiMascot/>

        <div class="login__content">
          <span class="login__title">
            С возвращением
          </span>

          <span class="login__subtitle">
            Мы рады видеть вас снова!
          </span>

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
          <div class="login__subform">
            <ui-checkbox
                v-model="rememberMe"
                label="Запомнить меня"
            />
            <ui-link label="Забыли пароль?"/>
          </div>
          <ui-button
              full-width
              label="Войти"
              native-type="submit"
          />

          <ui-divider label="или"/>

          <span class="login__registration">
            Нет аккаунта?
            <ui-link
                label="Зарегистрироваться"
                to="/register"
            />
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import UiMascot from "~/components/ui/ui-mascot/ui-mascot.vue";
import UiInput from "~/components/ui/ui-input/ui-input.vue";
import UiCheckbox from "~/components/ui/ui-checkbox/ui-checkbox.vue";
import UiButton from "~/components/ui/ui-button/ui-button.vue";
import UiLink from "~/components/ui/ui-link/ui-link.vue";
import UiDivider from "~/components/ui/ui-divider/ui-divider.vue";

useHead({
  title: 'Вход — Surik',
});

const email = ref('');
const password = ref('');
const rememberMe = ref(false);
</script>

<style lang="scss" scoped src="./index.scss"/>