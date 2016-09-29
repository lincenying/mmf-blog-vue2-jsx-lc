/* global window, editormd */
import api from '../api'
export default {
    data () {
        return {
            editors: null,
            form: {
                title: '',
                category: '',
                content: ''
            }
        }
    },
    methods: {
        handleChange(type, e) {
            this.form[type] = e.target.value
        },
        handleSubmit(e) {
            e.preventDefault()
            if (this.form.title === '') {
                this.$store.dispatch('showMsg', '请输入标题')
            } else if (this.form.category === '') {
                this.$store.dispatch('showMsg', '请选择分类')
            } else if ($("#editor").val() === '') {
                this.$store.dispatch('showMsg', '请输入内容')
            } else {
                api.postTopic({
                    title: this.form.title,
                    category: this.form.category,
                    content: window.postEditor.getHTML()
                }).then( () => {
                    this.$store.commit('DELETE_ADMIN_TOPICS_PATH')
                    this.$store.dispatch('showMsg', {
                        content: '发布成功',
                        type: "success"
                    })
                    $("#article-post").get(0).reset()
                    window.postEditor.clear()
                }, err => {
                    this.$store.dispatch('showMsg', err.toString())
                })
            }
        }
    },
    mounted() {
        window.postEditor = editormd("post-content", {
            width: "100%",
            height: 500,
            markdown: "",
            placeholder: '请输入内容...',
            path: '/static/editor.md/lib/',
            toolbarIcons() {
                return [
                    "bold", "italic", "quote", "|",
                    "list-ul", "list-ol", "hr", "|",
                    "link", "reference-link", "image", "code", "code-block", "table", "|",
                    "watch", "preview", "fullscreen", "|",
                    "help"
                ]
            },
            watch : false,
            saveHTMLToTextarea : true,
            imageUpload : true,
            imageFormats : ["jpg", "jpeg", "gif", "png", "bmp", "webp"],
            imageUploadURL : "/api/?action=upload"
        })
        this.$store.dispatch('gProgress', 100)
    },
    render(h) { // eslint-disable-line
        return (
            <div class="g-mn">
                <div class="box">
                    <form id="article-post" action="#" method="post">
                        <section id="post-title">
                            <input on-change={this.handleChange.bind(this, 'title')} type="text" name="title" class="form-control" placeholder="请输入标题" />
                        </section>
                        <section id="post-category">
                            <select on-change={this.handleChange.bind(this, 'category')} id="category" name="category" class="form-control">
                                <option value="">请选择分类</option>
                                <option value="1">生活</option>
                                <option value="2">工作</option>
                                <option value="3">其他</option>
                            </select>
                        </section>
                        <section id="post-content">
                            <textarea id="editor" name="content" class="form-control hidden" data-autosave="editor-content" />
                        </section>
                        <section id="post-submit">
                            <button on-click={this.handleSubmit} class="btn btn-success">发布</button>
                        </section>
                    </form>
                </div>
            </div>
        )
    }
}
