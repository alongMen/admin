import SearchArea from "@/components/search-area/index";

export default {
  components: {
    SearchArea,
  },
  data() {
    return {
      data: [],
      loading: false,
      total: 0,
      page: 1,
      limit: 15,
      query: {
        date: [],
      },
      btnLoading: false,
      showModal: false,
      total: 0,
    };
  },
  methods: {
    reset() {
      this.page = 1;
      this.query = {
        date: [],
      };
      this.getData();
    },

    search() {
      this.page = 1;
      this.getData();
    },

    pageChange(page) {
      this.page = page;
      this.getData();
    },
  },

  mounted() {
    this.getData();
  },
};
