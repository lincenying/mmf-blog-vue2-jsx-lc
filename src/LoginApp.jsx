/* global window */
import '../html/css/login.css'
import '../node_modules/toastr/build/toastr.css'
import { mapGetters } from 'vuex'
import ls from 'store2'
import api from './api'
export default {
    computed: {
        ...mapGetters({
            global: 'getGlobal'
        })
    },
    data() {
        return {
            form: {
                username: '',
                password: '',
                remember_me: ''
            }
        }
    },
    methods: {
        handleAddUser() {
            api.addUser().then(msg => {
                console.log(msg)
            }, error => {
                this.$store.dispatch('showMsg', error.toString())
            })
        },
        handleChange(type, e) {
            this.form[type] = e.target.value
        },
        handleSubmit(e) {
            e.preventDefault()
            if (this.form.username === '' || this.form.password === '') {
                this.$store.dispatch('showMsg', '请输入用户名和密码')
                return false
            }
            api.login({
                username: this.form.username,
                password: this.form.password
            }).then(message => {
                this.$store.dispatch('showMsg', {
                    content: '登录成功',
                    type: 'success'
                })
                ls.set("token", message.id)
                setTimeout(() => {
                    window.location.href = "/post"
                }, 1000)
            }, error => {
                this.$store.dispatch('showMsg', error.toString())
            })
        }
    },
    render(h) { // eslint-disable-line
        return (
            <section class="container">
                <div class="login">
                    <h1>后台管理</h1>
                    <form id="shake-setting" action="#" method="post" on-submit={this.handleSubmit}>
                        <p><input on-change={this.handleChange.bind(this, 'username')} type="text" name="username" value="" placeholder="请输入用户名" /></p>
                        <p><input on-change={this.handleChange.bind(this, 'password')} type="password" name="password" value="" placeholder="请输入密码" /></p>
                        <p class="remember_me">
                            <label>
                                <input on-change={this.handleChange.bind(this, 'remember_me')} value="on" type="checkbox" name="remember_me" id="remember_me" />
                                保持登录
                            </label>
                        </p>
                        <p class="submit"><input type="submit" value="登录" /></p>
                        <p class="submit"><input on-click={this.handleAddUser} type="button" value="添加用户" /></p>
                    </form>
                </div>
            </section>
        )
    }
}
