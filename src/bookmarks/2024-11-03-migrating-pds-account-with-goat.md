---
date: 2024-11-03T17:24:39.712Z
title: Migrating PDS Account with `goat`
bookmarkOf: https://whtwnd.com/bnewbold.net/3l5ii332pf32u
references:
  https://whtwndCom/bnewboldNet/3L5Ii332Pf32U:
    url: https://whtwnd.com/bnewbold.net/3l5ii332pf32u
    type: screen
    children:
      - type: full
        name: |-
          Account migration is an important feature of atproto, and has been possible in the live network since February of this year, but is still a bit scary and developer-oriented.
          As part of documenting the migration process, I recently implemented basic account migration in the goat CLI tool for atproto. This blog post walks through both the "automatic" and "manual" variants of account migration, and then describes ways this process could be made even more safe and accessible.
          The basic account migration steps are:

          Establish "Deactivated" Account on new PDS
          Migrate Content: Repository, Blobs, Preferences
          Update Identity
          Swap Active/Deactivated Accounts

          For a longer description of atproto account migration, including a helpful diagram, see the original write-up by @dholms.xyz.
          You can read more about goat in the indigo repo.
          Independent PDS Hosting and Migration
          As some background context, the Bluesky atproto services have been fully "federated" since early 2024. This feature is no longer "beta" and there are no significant restrictions on PDS instance size. There are abuse-prevention rate-limits on how fast accounts and content will be ingested from new PDS by the Bluesky Relay, but we are happy to raise them on request. There is no prior registraiton required, and there is no "10 account limit".
          One restriction that is still in place is that accounts can not fully migrate inbound to the Bluesky PDS hosts. The identity aspect of migration might work for "returning" accounts, but the importRepo endpoint is not allowed. This is purely an operational issue where PDS worker processes currently "hang" while processing large imports, which impact other users. This isn't a big concern for smaller PDS instances, but for large instances with hundreds of thousands of accounts, and very large account imports (millions of records) it can cause significant service disruptions. Inbound account migration will be allowed once this operational issue is mitigated.
          Automatic Account Migration
          If the old PDS is online and the old account is active, and the DID is a did:plc, then migration is quite simple, with goat facilitating most steps with a single command.
          Ahead of time, you should collect the following information:

          your existing account credentials ($ACCOUNTDID, $OLDHANDLE, $OLDPASSWORD)
          the new PDS host and service DID ($NEWPDSHOST, $NEWPDSSERVICEDID)
          invite code for the new PDS ($INVITECODE)
          desired new PDS handle and credentials ($NEWHANDLE, $NEWEMAIL, $NEWPASSWORD)

          The current flow assumes that you get a new "local" handle on the new PDS. If you have a custom domain handle, you can update to that after the rest of the account migration is complete.
          Log in to your existing account using goat, using a full password (not app password):
          goat account login -u $OLDHANDLE -p $OLDPASSWORD

          Identity updates are a sensitive operation requiring a 2FA email token, so you need to request that token:
          goat account plc request-token

          The code ($PLCTOKEN) will arrive via email.
          Then you can run the all-in-one command:
          goat account migrate \
              --pds-host $NEWPDSHOST \
              --new-handle $NEWHANDLE \
              --new-password $NEWPASSWORD \
              --new-email $NEWEMAIL \
              --plc-token $NEWPLCTOKEN \
              --invite-code $INVITECODE

          If all goes well, the new account will be created, content will be migrated, and identity and account status will be synchronized. Log lines will indicate progress. You'll want to log out of all clients (including goat) and log back in.
          If something goes wrong at the account creation step, it may be possible to re-run the entire command. If something fails after that, it may be necessary to complete the process "manually", using the steps below.
          Manual Account Migration
          In some situations the automatic process might not be possible or desirable. These more manual commands give more control over the process, work with different DID methods, give more direct control over the final DID document, result in local backups of all public data (and private preferences), and may allow recovery if the original PDS is down or uncooperative (assuming self-control of the DID).
          These steps require flipping back and forth between goat logged in to the old PDS and the new PDS. Instead of showing those goat account login / logout commands, these directions will indicate which PDS should be authenticated at each step.
          You can fetch metadata about a PDS, including the service DID and supported handle suffix:
          # no auth required
          goat pds describe $NEWPDSHOST

          # for example
          goat pds describe https://bsky.social
          {
            "availableUserDomains": [
              ".bsky.social"
            ],
            "did": "did:web:bsky.social",
            "inviteCodeRequired": false,
            "links": {
              "privacyPolicy": "https://blueskyweb.xyz/support/privacy-policy",
              "termsOfService": "https://blueskyweb.xyz/support/tos"
            },
            "phoneVerificationRequired": true
          }

          To create an account with an existing DID on the new PDS, we first need to generate a service auth token:
          # old PDS
          goat account service-auth --lxm com.atproto.server.createAccount --aud $NEWPDSSERVICEDID --duration-sec 3600

          This returns a large base64-encoded token ($SERVICEAUTH).
          Now an account can be created on the new PDS, using the existing DID:
          # no auth
          goat account create \
              --pds-host $NEWPDSHOST \
              --existing-did $ACCOUNTDID \
              --handle $NEWHANDLE \
              --password $NEWPASSWORD \
              --email $NEWEMAIL \
              --invite-code $INVITECODE \
              --service-auth $SERVICEAUTH

          The new account will be "deactivated", because the identity (DID) does not point to this PDS host yet. To log in to an account when the DID doesn't resolve yet, goat requires specifying the PDS host:
          goat account login --pds-host $NEWPDSHOST -u $ACCOUNTDID -p $NEWPASSWORD

          You can check the current account status like:
          # new PDS
          goat account status
          {
              "activated": false,
              "expectedBlobs": 0,
              "importedBlobs": 0,
              "indexedRecords": 0,
              "privateStateValues": 0,
              "repoBlocks": 2,
              "repoCommit": "bafyreie2o6idkbnpkhkwp6ocf7p5k7np2t7xnx3346zqc456f3avhsnhue",
              "repoRev": "3l5ddasaitk23",
              "validDid": false
          }

          Next to migrate content, starting with repo:
          # old PDS
          goat repo export $ACCOUNTDID

          # will write a CAR file like ./account.20240929112355.car

          # new PDS
          goat repo import ./account.20240929112355.car

          Once all the old records are indexed, the new PDS will know how many blobs are expected (expectedBlobs in account status), and how many have been imported (importedBlobs). You can also check the specific "missing" blobs:
          # new PDS
          goat account missing-blobs

          bafkreibyu5mlurlwyjj2ewfjddmm7euiq47xisdyf4sil46s2zu4bultiu	at://did:plc:c7ilkj3gs7mdo3d6vdbebgk2/app.bsky.actor.profile/self
          bafkreieymnbzgpcjdebyjewy3z7jmpqg6h3uf5fl4khuywz65tgmknvlgu	at://did:plc:c7ilkj3gs7mdo3d6vdbebgk2/app.bsky.feed.post/3l5cs7sszcx2s
          [...]

          To export and import all blobs:
          # old PDS
          goat blob export $ACCOUNTDID

          # will create a directory like ./account_blobs/

          # new PDS
          # this requires the 'fd' (fd-find) and 'parallel' commands
          fd . ./account_blobs/ | parallel -j1 goat blob upload {}

          You can confirm that there are no missing blobs, and that the blob and record counts match the old PDS.
          Next, private Bluesky app preferences.
          As a warning, the current Go code for serializing/deserializing preferences may be "lossy" if the preference schemas are out of sync or for non-Bluesky Lexicons, and it is possible this step will lose some preference metadata. This will hopefully be improved in a future version of goat, or when the preferences API is updated to be app-agnostic ("personal data" protocol support).
          # old PDS
          goat bsky prefs export > prefs.json

          # new PDS
          goat bsky prefs import prefs.json

          With all the content migrated to the new account, we can update the identity (DID) to point at the new PDS instance.
          Fetch the "recommended" DID parameters from the new PDS:
          # new PDS
          goat account plc recommended > plc_recommended.json

          If you are self-managing your identity (eg, did:web or self-controlled did:plc), you can merge these parameters in to your DID document.
          If using a PDS-managed did:plc, you can edit the parameters to match any additional services or recovery keys. Save the results as ./plc_unsigned.json. You will need to request a PLC signing token from the PDS:
          # old PDS
          goat account plc request-token

          Retrieve the token ($PLCTOKEN) from email, then request a signed version of the PLC params:
          # old PDS
          goat account plc sign --token $PLCTOKEN  ./plc_unsigned.json > plc_signed.json

          If that looks good, the PLC Op can be submitted from the new PDS:
          # new PDS
          goat account plc submit ./plc_signed.json

          Check the account status on the new PDS, and validDid should now be true.
          As the final steps, the new PDS account can be activated:
          # new PDS
          goat account activate

          and the old PDS account deactivated:
          # old PDS
          goat account deactivate

          You may chose to delete the old account once you are confident the new account is configured and running as expected.
          Future Work
          The repo import and blob migration steps could show progress bars, especially for accounts with a lot of content.
          The auto-migrate tool could detect the current status better, and "continue where it left off" in some situations.
          Getting account migration integrated in to the Bluesky app itself is the ultimate goal, though having better support in external tooling is still a big step forward. An independent app (mobile, desktop, or server side) could help maintain backups of repo content, blobs, and identity, and facilitate account migration (or recovery) in cases where the original PDS is not available.
          It would be good to have better tooling for PLC recovery keys. If goat was involved in that, it could help manage those extra keys during the migration process, or sign and submit PLC operations directly, instead of via PDS instances.Share in Bluesky Share in X (Twitter) Share in Threads Copy permalink Copy permalink (strict)WhiteWind will show `Contents changed` badge if contents are edited
      - type: full
        children:
          - type: full
            name: ""
            url: https://whtwnd.com/bnewbold.net
          - type: full
            name: ""
            url: https://whtwnd.com/bnewbold.net
      - type: full
        name: Post reaction in BlueskyInsert link card*To be shown as a reaction, include article link in the post or add link cardPost
      - type: full
        name: Reactions from everyone (0)
      - type: full
        children:
          - type: full
            name: ""
            url: https://whtwnd.com/bnewbold.net
          - type: full
            name: ""
            url: https://whtwnd.com/bnewbold.net
---

If hosting a PDS for a secondary/test account goes OK, I guess the next step would be to migrate my "main" Bluesky account to that PDS.
