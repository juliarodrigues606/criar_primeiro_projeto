/// <reference types="cypress" />
import  { faker } from '@faker-js/faker'

describe('enviando formulario usando cypress', () => {
    beforeEach(() => {
      cy.visit('https://automationintesting.online/')
    })

    it.only('Não deve realizar envio do e-mail ao enviar formulario de cadastro vazio', () => {
        cy.intercept('POST', '/message*').as('message')

        cy.get('#submitContact').click()
        cy.wait('@message').then(({response}) => {
             expect(response.statusCode).eq(400)
             expect(response.body.error).eq('BAD_REQUEST')
        }) 
    })

    it.only('Deve realizar envio do e-mail ao enviar formulario preenchido', () => {
        let name = faker.name.firstName()
        let email = faker.internet.email()
        let phone = faker.phone.number()
        let subject = faker.lorem.sentence()
        let description = faker.lorem.paragraph()
        
        cy.get('[data-testid="ContactName"]').type(name)
        cy.get('[data-testid="ContactEmail"]').type(email)
        cy.get('[data-testid="ContactPhone"]').type(phone)
        cy.get('[data-testid="ContactSubject"]').type(subject)
        cy.get('[data-testid="ContactDescription"]').type(description)
        
        cy.intercept('POST', '/message*').as('message')

        cy.get('#submitContact').click()
        cy.wait('@message').then(({response}) => {
             expect(response.statusCode).eq(201)
             expect(response.body.messageid).is.not.null
             cy.log('Só para mostrar que se eu precissasse usar o ID tinha como: '+ response.body.messageid)
             expect(response.body.name).eq(name)
             expect(response.body.email).eq(email)
             expect(response.body.phone).eq(phone)
             expect(response.body.subject).eq(subject)
             expect(response.body.description).eq(description)
        }) 
    })


})