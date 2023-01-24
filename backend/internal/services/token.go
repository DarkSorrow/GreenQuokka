package services

import (
	"aidanwoods.dev/go-paseto"
	"github.com/jaevor/go-nanoid"
)

type PasetoV4 struct {
	SecretKey paseto.V4SymmetricKey
	//PublicKey paseto.V4AsymmetricPublicKey
}

type JWT struct {
}

// If we start using different structure to check keys we will use the type
// and call the correct structure depending on that to start a smooth migration
// TODO: Create a map of pasetoV4 to manage several keys?
// Have a secure server to hold keys maybe?
type TokenManager struct {
	SysType string
	Pas     PasetoV4
	// Generate an ID of 14 characters length for an item
	ItemsID func() string
	// Generate an ID of 21 characters length for an item
	CanonicID func() string
	// Generate an ID with only ASCII character of 21 length
	AsciiID func() string
}

// map[string]PasetoV4 the string is MMYYYY
// we pass in the header token the MMYYYY{generatedID}
// Rotate SymmetricKeys every two months
func NewTokenManager() *TokenManager {
	//secretKey := paseto.NewV4SymmetricKey()
	//secretKey.ExportHex()
	secretKey, err := paseto.V4SymmetricKeyFromHex("ed0b531957f82396c9e743e33b6bd5f2c9127119caa05ff8f4583edc6a64df45")
	if err != nil {
		panic("Can't load asymetric key")
	}

	itemsID, err := nanoid.Standard(14)
	if err != nil {
		panic(err)
	}

	canonicID, err := nanoid.Standard(21)
	if err != nil {
		panic(err)
	}

	asciiID, err := nanoid.ASCII(21)
	if err != nil {
		panic(err)
	}
	//publicKey := secretKey.Public()
	return &TokenManager{
		SysType: "paseto4",
		Pas: PasetoV4{
			SecretKey: secretKey,
			//PublicKey: publicKey,
		},
		ItemsID:   itemsID,
		CanonicID: canonicID,
		AsciiID:   asciiID,
	}
}
