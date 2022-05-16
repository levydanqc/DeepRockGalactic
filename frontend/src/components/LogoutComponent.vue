<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "LogoutComponent",
  created() {
    localStorage.removeItem("token");
    this.$router.push("/");
  },
});
</script>

<style></style>
