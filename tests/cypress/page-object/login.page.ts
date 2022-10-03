import { BasePage } from './base.page'

class LoginPage extends BasePage {
    elements = {
        loginForm: 'form[name="loginForm"]',
        loginFormUsername: 'input[name=username]',
        loginFormPassword: 'input[name=password]',
        loginFormRememberMe: 'input[name=useCookie]',
    }

    visit() {
        cy.visit('/')
        return this
    }

    login(username: string, password: string, rememberMe: boolean) {
        cy.get(this.elements.loginFormUsername).type(username)
        cy.get(this.elements.loginFormPassword).type(password)
        if (rememberMe) {
            cy.get(this.elements.loginFormRememberMe).check()
        } else {
            cy.get(this.elements.loginFormRememberMe).uncheck()
        }
        cy.get(this.elements.loginForm).submit()
    }

    logout() {
        cy.visit(Cypress.config().baseUrl + '/cms/logout')
    }
}

export const loginPage = new LoginPage()
