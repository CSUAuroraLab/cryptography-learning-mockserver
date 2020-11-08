import { ApolloServer, ApolloError, MockList } from 'apollo-server'
import { loadSchemaSync } from '@graphql-tools/load'
import { GraphQLScalarType } from 'graphql'
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'
import { Kind } from 'graphql/language'
import faker from 'faker'

const schema = loadSchemaSync('schema.graphql', { loaders: [new GraphQLFileLoader()] })

const resolverMap = {
  // useless at this time
  Time: new GraphQLScalarType({
    name: 'Time',
    description: 'Time',
    parseValue(value) {
      return new Date(value) // value from the client
    },
    serialize(value) {
      return value.getTime() // value sent to the client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return new Date(+ast.value) // ast value is always in string format
      }
      return null
    },
  }),
}

const apolloError = new ApolloError('aaaaa')

const mocks = {
  Time: () => {
    return new Date()
  },
  // uncomment next line if want to mock error
  // Practice: () => apolloError,
  Practice: () => new MockList(5),
  String: () => faker.hacker.noun(),
  Int: () => faker.random.number(),
  // LabInstance: () => ({
  //   lang: () => "faker.hacker.noun()",
  //   name: () => "faker.hacker.noun()",
  //   content: () => "faker.hacker.noun()",
  // }),
  LabInstance: () => ({
    lang: () => faker.random.locale(),
    content: () => `# Iovis vellem

## Moras in opem

Lorem markdownum et fuerint vivit defunctum celebravit quis silentia undas
tenuisset. Et gradu! Tum deus, ubi crescunt tenens perque, cum putabant morari
peregrinaeque vincla.

- Metus aede
- Utraque quaesitisque terras aequor quater
- Nec montesque in ratem deos levitate passae
- Rursusque Cycnum illis defectos puer modo separat
- Structis caelesti brevem pennis

Lux mansit nectareis inter iubar decorem agitataque manum occumbere *caelatus*.
Innitens quem Theseus: capulo *taurorum adversi* venturis dubitare tacitaque
torum in adnuit quidem? Nostri quis non rerum aspexit *colubrae fit* quod dedere
quoque pulsabant Ausoniae ferro aquilonibus dei, oculos redit omnis quo.

Letum exegit concordi ut vacuas, falso cum mercibus posito ea. Moenia caelum,
possis perarantem ferebat auctor reminiscitur ipsam, quaeque, Pallade longius
latitantem nisi. Puer credere, dant quem Iovi malo abit quae leti remolliat
hinc, herba ut dixit ait. Ad nata exercet nectare coepere pulvereumque illa
femina; selige mons quem in tandem perosus coloni staret serpens mihi. Cum
meliore fuit duro patrem sereno caelo aequoris et aquis.

## Pelasgas in stabis feris amens vigili contendere

Posse est genetricis [ad sibi Procne](http://www.iuvenali-ales.io/flagrant) hoc
peremi suos inposita. Caesar recidendum inposito solus, nec marcentia pauca:
potest diu Cerambi manus; et est inanis. Viribus tanto Calliroe cecidere;
incipit quod procerum quid Inachides humano premebat. Nostro despicit reperta
quam ab possumus videoque ambiguo.

1. Blandita deus cape aevo vidistis aethera
2. Quae fui crescente pietas telis
3. Mihi ieiunia illa certare porto nudorum sumptas
4. Est mox denos infantem

Ad curribus [partique](http://quae-onus.io/est) in quoque intra exspectata.
Viseret est; carcere vos nefas non eversam tuae illam moriemur palustris, amaris
Mygdoniusque rubor, hastae terroris namque. Praestantior omnes viae eodem quod
quod merito totaeque inquit sororum in nunc vel ictu mortales sua lumina. Nec
Thisbe lacrimas nomenque voluit *horret nimiumque* maris unde leonibus sumere
echidnis, sed.

1. Dum antro non coepi desierat ungues fuisset
2. Ipse sed Tereusque altior foedera patriumque rector
3. Tendunt Cyclopum iudicium aures coniuge

[Adeam nymphae potentem](http://celeri-verti.io/admonetter.html) remissis sub,
speculatur ut fatis communis. Deus est obortis ignes, cum tecto Ditis servat
aspicit puer, Atque sensim medium spectem **uti manere**, suae.

When using RSA to perform a sign or decrypt operation, a common performance speedup is to use the Chinese Remainder Theorem to operate in the groups$Z/pZ$ and $Z/qZ$, rather than $Z/nZ$ (where  $p∗q=n$). Rather than computing $x^d \mod n$ the optimization is outlined below: 

$$Compute:dp = e^{-1}\mod (p-1),dq = e^{-1}\mod (q-1),qinv=q^{-1}\mod p$$

The RSA private key is now the tuple $(p,q,dp,dq,qinv)$ rather than the usual value of just $d$. Now, to compute a signature $y$ for message$x$, or perform a decrypt operation on $x$ we do the following: 

$$y_1=x^{dp}\mod p,y_2=x^{dq}\mod q,h=qinv*(y_1-y_2)\mod p$$

$$y=y_2+h*q$$

As recently highlighted in [this paper](https://people.redhat.com/~fweimer/rsa-crt-leaks.pdf), if the computation of $y1$ or $y2$ (but not both) fails, it is possible to recover a factor of $n$.

Now, hers's your challenge, connect the server and give your answer.

::: danger "real world attack"
    After RSA-CRT Leak Report for September/October 2015, Florian Weimer had done lots of work on it and release it on <http://www.enyo.de/fw/security/rsa-crt-leaks/2015-10.html>, we can see there were some software did updates to harden their cryptographic libraries against RSA-CRT leaks, which mean they had this vulnerability before.
:::

::: warning "密码学小知识"

    尽管在大多数时候，快就是好，但是在安全上，却经常不得不牺牲性能来获取安全。不仅只是加密解密需要消耗时间，甚至我们还需要故意使得加密、解密更慢，来抵抗[测信道攻击](https://zh.wikipedia.org/zh/%E6%97%81%E8%B7%AF%E6%94%BB%E5%87%BB)。就拿RSA来说，我们知道大数运算是一件相当耗时的操作，而计算机又是按位来存储的，所以就可能存在这样的实现，在这样的实现中，当当前计算的二进制位为1时，计算机的功耗就会明显上升，而当前计算二进制位为0时则不上升，那么攻击者在获得计算机的功耗图后，就可以获得密钥了。
:::`
  })
}

const server = new ApolloServer({
  schema,
  resolvers: resolverMap,
  mocks: mocks,
})

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`)
})