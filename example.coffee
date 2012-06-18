print = (args...) -> console.log(args...)
every = (time, fn) -> setInterval(fn, time)
choice = (l) -> l[Math.floor(l.length*Math.random())]

randword = ->
    return (choice("QWRTPSDFGHJKLZXCVBNMQQQFFF") + 
        choice("EYUIOA") + 
        choice("QWRTPSDFGHJKLZXCVBNMXXX012345"))
        
uuid =  (prefix="u") -> 
    u = -> Math.random().toString(32)[2...]
    return prefix + u() + u() + u()

{div, span} = onecup

class Model

    on: (kind, selector, fn) ->
        $("body").on(kind + ".#{@id}", "##{@id} " + selector, fn)
        
    remove: ->
        print "removing events"
        $("##{@id}").remove()
        $("body").off(".#{@id}")
        @id = null
        
    refresh: ->
        html = onecup.render(@.render())
        $("##{@id}").replaceWith(html)

class Page extends Model
    constructor: ->
        @id = uuid()
        @tabs = for card in [0..5]
            new Tab()  

    render: ->
        div "##{@id}.tabs", =>
            for tab in @tabs
                tab.render()

class Tab extends Model
    constructor: ->
        @id = uuid()
        @selected = false
        @cards = for card in [0..20]
            new Card()

        @on "click", ".card", (e) =>
            $t = $(e.currentTarget)
            print "clicked", $t
            $t.fadeOut()
            @cards = for card in @cards 
                if card.id == $t.attr('id')
                    print "removed", card
                    continue
                card
            if @cards.length == 0
                @remove()
                
            print $("body").data("events")

        @task = every Math.random()*1000, =>
            #print "update"        
            card = choice(@cards)
            card.price += Math.random()
            card.refresh()
        
    remove: ->
        super()
        clearInterval(@task)
        
    render: ->
        div "##{@id}.cards", =>
            div ".header", "tab:"
            div ".tab", =>
                for card in @cards
                    card.render()

class Card extends Model
    constructor: ->
        @id = uuid()
        @name = randword()
        @price = (Math.random()*1000)
        @kind = Math.floor(Math.random()*4) + 1
        
    render: ->
        div "##{@id}.card.kind#{@kind}", =>
            div ".name", @name
            div ".price", @price.toFixed(2)
            
$ ->
    page = new Page()
    print page
    html = onecup.render(page.render())
    $("body").html(html)
    
    


