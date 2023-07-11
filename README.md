1. Get certificate from domain (api.github.com:443) and append the certificate into a file `cert.pem`

````
echo -n | openssl s_client -connect api.github.com:443 | sed -ne '/-BEGIN CERTIFICATE-/,/-END CERTIFICATE-/p' > cert.pem
````

2. Generate fingerprint:

```
openssl x509 -noout -in cert.pem -fingerprint
```
