<template>
  <div class="editor-container">
    <!--编辑器主体-->
    <div ref="editor" @input="outputContent" :style="{ height: height }"></div>
    <Modal v-model="showModal" title="">
      <Upload action="//jsonplaceholder.typicode.com/posts/"> </Upload>
    </Modal>
  </div>
</template>

<style></style>

<script type="text/babel">
import { editor_upload_file } from "@/utils/upload";
import WangEditor from 'wangeditor';
export default {
  name: 'nr-editor',
  data() {
    return {
      showModal: false, // 是否打开上传
      content: '', // 内容
      editor: '', // 编辑器
      insert: '', // 图片上传insert方法
      file: '', // 选择的图片
      uploadedFiles: [], // 已经上传的图片
      menus: [
        'head', // 标题
        'bold', // 粗体
        'italic', // 斜体
        'underline', // 下划线
        'strikeThrough', // 删除线
        'foreColor', // 文字颜色
        'backColor', // 背景颜色
        'link', // 插入链接
        'list', // 列表
        'justify', // 对齐方式
        'quote', // 引用
        'emoticon', // 表情
        'image', // 插入图片
        'table', // 表格
        'video', // 插入视频
        'code', // 插入代码
        'undo', // 撤销
        'redo', // 重复
      ],
    };
  },
  props: {
    initContent: String, // 初始内容
    noUse: Array, // 不需要的菜单集合
    custom: Array, // 自定义的菜单集合
    height: {
      // 编辑器高度
      type: String,
      default() {
        return '400px';
      },
    }, // 自定义高度
    zIndex: {
      // 自定义层级，避免同个页面多个编辑器时，会出现下面的编辑器遮挡住上面的编辑器弹层的情况
      type: Number,
      default() {
        return 100;
      },
    },
  },
  computed: {
    editorMenu: {
      get() {
        const menus = this.custom || this.menus;
        if (this.noUse) {
          return menus.filter(
            menu => !this.noUse.find(noUseMenu => noUseMenu === menu),
          );
        }
        return menus;
      },
    },
  },
  methods: {
    /**
     * 创建editor
     */
    createEditor() {
      const editor = new WangEditor(this.$refs.editor);
      editor.customConfig.menus = this.editorMenu;
      editor.customConfig.customUploadImg = this.upload;
      editor.customConfig.onchange = html => {
        this.formatContent(html);
      };
      const editorNum = document.querySelectorAll('.wangEditor-container')
        .length;
      editor.customConfig.zIndex = this.zIndex - editorNum;
      editor.create();
      this.editor = editor;
      this.editor.txt.html(this.initContent);
    },
    /**
     * 获取content
     * @param content
     */
    formatContent(content) {
      this.content = content;
      this.outputContent();
    },
    /**
     * 将content传递给父组件
     */
    outputContent() {
      this.$emit('input', this.content);
    },
    /**
     * 更新editor内容
     */
    updateEditor() {
      this.$nextTick(() => {
        if (this.initContent) {
          this.editor.txt.html(this.initContent);
        } else {
          this.editor.txt.html('<p><br></p>');
        }
        this.formatContent();
      });
    },
    /**
     * 上传图片
     */
    async upload(files, insert) {
      // this.showModal = true
      this.file = files[0];
      const res = await editor_upload_file(this.file, "board");
      if (res.res.status < 400) {
        this.insert = insert;
        this.insert(res.url);
        this.file = "";
      }
    },
    /**
     * 上传成功，如果上传的数量和选择的数量相等，关闭弹层
     */
    uploadImage(event) {
      if (this.insert) {
        this.insert(event.uri);
        this.uploadedFiles.push(event);
        if (this.files.length === this.uploadedFiles.length) {
          this.closeDialog();
        }
      } else {
        this.closeDialog();
      }
    },
    /**
     * 关闭上传图片弹层
     */
    closeDialog() {
      this.isUpload = false;
    },
    /**
     * 上传弹层关闭前，清空上传的图片数据
     */
    onUploadClose() {
      this.files = [];
      this.uploadedFiles = [];
    },
  },
  watch: {
    /**
     * initContent有变动时,重新更新editor中的内容
     */
    initContent() {
      this.updateEditor();
    },
  },
  // components: {
  //   NrFormImageUploader
  // },
  mounted() {
    this.createEditor();
  },
};
</script>
