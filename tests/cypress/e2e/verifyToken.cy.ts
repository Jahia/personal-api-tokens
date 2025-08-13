describe('test', () => {
    it('should pass', () => {
        cy.login()
        cy.apollo({
            variables: {
                token: '9ZcOMzQ/T8aO+PaovscsSrPSQ8GRQI5dyd8FKMieVXk=',
            },
            queryFile: 'verifyToken.graphql',
        }).then((response) => {
            console.log(response)
            expect(response.data.admin.personalApiTokens.verifyToken).to.equal(true)
        })
    })
})
