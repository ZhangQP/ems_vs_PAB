cmd_/home/how/projects/quicklake-js-node/out/Release/obj.target/node/src/tls_wrap.o := g++ '-DNODE_ARCH="x64"' '-DNODE_PLATFORM="linux"' '-DNODE_WANT_INTERNALS=1' '-DV8_DEPRECATION_WARNINGS=1' '-DNODE_OPENSSL_SYSTEM_CERT_PATH=""' '-DHAVE_INSPECTOR=1' '-D__POSIX__' '-DHAVE_OPENSSL=1' '-DNODE_USE_V8_PLATFORM=1' '-DNODE_HAVE_I18N_SUPPORT=1' '-DNODE_HAVE_SMALL_ICU=1' '-DNGHTTP2_STATICLIB' '-DUCONFIG_NO_SERVICE=1' '-DUCONFIG_NO_REGULAR_EXPRESSIONS=1' '-DU_ENABLE_DYLOAD=0' '-DU_STATIC_IMPLEMENTATION=1' '-DU_HAVE_STD_STRING=0' '-DUCONFIG_NO_BREAK_ITERATION=0' '-DHTTP_PARSER_STRICT=0' '-D_LARGEFILE_SOURCE' '-D_FILE_OFFSET_BITS=64' '-D_POSIX_C_SOURCE=200112' -I../src -I../tools/msvs/genfiles -I/home/how/projects/quicklake-js-node/out/Release/obj/gen -I../deps/nghttp2/lib/includes -I/home/how/projects/quicklake-js-node/out/Release/obj/gen/include -I../deps/openssl/openssl/include -I../deps/v8/include -I../deps/icu-small/source/i18n -I../deps/icu-small/source/common -I../deps/zlib -I../deps/http_parser -I../deps/cares/include -I../deps/uv/include  -pthread -Wall -Wextra -Wno-unused-parameter -m64 -O3 -fno-omit-frame-pointer -fno-rtti -fno-exceptions -std=gnu++0x -MMD -MF /home/how/projects/quicklake-js-node/out/Release/.deps//home/how/projects/quicklake-js-node/out/Release/obj.target/node/src/tls_wrap.o.d.raw   -c -o /home/how/projects/quicklake-js-node/out/Release/obj.target/node/src/tls_wrap.o ../src/tls_wrap.cc
/home/how/projects/quicklake-js-node/out/Release/obj.target/node/src/tls_wrap.o: \
 ../src/tls_wrap.cc ../src/tls_wrap.h ../src/node.h \
 ../deps/v8/include/v8.h ../deps/v8/include/v8-version.h \
 ../deps/v8/include/v8config.h ../src/node_version.h ../src/node_crypto.h \
 ../src/node_crypto_clienthello-inl.h ../src/node_crypto_clienthello.h \
 ../src/util-inl.h ../src/util.h ../src/node_buffer.h ../src/env.h \
 ../src/aliased_buffer.h ../deps/cares/include/ares.h \
 ../deps/cares/include/ares_version.h ../deps/cares/include/ares_build.h \
 ../deps/cares/include/ares_rules.h ../src/inspector_agent.h \
 ../src/node_debug_options.h ../src/node_platform.h \
 ../deps/v8/include/libplatform/libplatform.h \
 ../deps/v8/include/libplatform/libplatform-export.h \
 ../deps/v8/include/libplatform/v8-tracing.h \
 ../deps/v8/include/v8-platform.h ../src/node_mutex.h \
 ../deps/uv/include/uv.h ../deps/uv/include/uv-errno.h \
 ../deps/uv/include/uv-version.h ../deps/uv/include/uv-unix.h \
 ../deps/uv/include/uv-threadpool.h ../deps/uv/include/uv-linux.h \
 ../src/handle_wrap.h ../src/async-wrap.h ../src/base-object.h \
 ../src/req-wrap.h ../src/node_http2_state.h ../src/async-wrap-inl.h \
 ../src/base-object-inl.h ../src/env-inl.h ../src/node_perf_common.h \
 ../src/node_internals.h ../src/tracing/trace_event.h \
 ../src/node_platform.h ../src/tracing/trace_event_common.h \
 ../deps/openssl/openssl/include/openssl/ssl.h \
 ../deps/openssl/openssl/include/openssl/e_os2.h \
 ../deps/openssl/openssl/include/openssl/opensslconf.h \
 ../deps/openssl/openssl/include/openssl/../../crypto/opensslconf.h \
 ../deps/openssl/openssl/include/openssl/../../crypto/../../config/opensslconf.h \
 ../deps/openssl/openssl/include/openssl/../../crypto/../../config/./archs/linux-x86_64/opensslconf.h \
 ../deps/openssl/openssl/include/openssl/comp.h \
 ../deps/openssl/openssl/include/openssl/crypto.h \
 ../deps/openssl/openssl/include/openssl/stack.h \
 ../deps/openssl/openssl/include/openssl/safestack.h \
 ../deps/openssl/openssl/include/openssl/opensslv.h \
 ../deps/openssl/openssl/include/openssl/ossl_typ.h \
 ../deps/openssl/openssl/include/openssl/symhacks.h \
 ../deps/openssl/openssl/include/openssl/bio.h \
 ../deps/openssl/openssl/include/openssl/x509.h \
 ../deps/openssl/openssl/include/openssl/buffer.h \
 ../deps/openssl/openssl/include/openssl/evp.h \
 ../deps/openssl/openssl/include/openssl/objects.h \
 ../deps/openssl/openssl/include/openssl/obj_mac.h \
 ../deps/openssl/openssl/include/openssl/asn1.h \
 ../deps/openssl/openssl/include/openssl/bn.h \
 ../deps/openssl/openssl/include/openssl/ec.h \
 ../deps/openssl/openssl/include/openssl/ecdsa.h \
 ../deps/openssl/openssl/include/openssl/ecdh.h \
 ../deps/openssl/openssl/include/openssl/rsa.h \
 ../deps/openssl/openssl/include/openssl/dsa.h \
 ../deps/openssl/openssl/include/openssl/dh.h \
 ../deps/openssl/openssl/include/openssl/sha.h \
 ../deps/openssl/openssl/include/openssl/x509_vfy.h \
 ../deps/openssl/openssl/include/openssl/lhash.h \
 ../deps/openssl/openssl/include/openssl/pkcs7.h \
 ../deps/openssl/openssl/include/openssl/pem.h \
 ../deps/openssl/openssl/include/openssl/pem2.h \
 ../deps/openssl/openssl/include/openssl/hmac.h \
 ../deps/openssl/openssl/include/openssl/kssl.h \
 ../deps/openssl/openssl/include/openssl/ssl2.h \
 ../deps/openssl/openssl/include/openssl/ssl3.h \
 ../deps/openssl/openssl/include/openssl/tls1.h \
 ../deps/openssl/openssl/include/openssl/dtls1.h \
 ../deps/openssl/openssl/include/openssl/pqueue.h \
 ../deps/openssl/openssl/include/openssl/ssl23.h \
 ../deps/openssl/openssl/include/openssl/srtp.h \
 ../deps/openssl/openssl/include/openssl/engine.h \
 ../deps/openssl/openssl/include/openssl/rand.h \
 ../deps/openssl/openssl/include/openssl/ui.h \
 ../deps/openssl/openssl/include/openssl/err.h \
 ../deps/openssl/openssl/include/openssl/x509v3.h \
 ../deps/openssl/openssl/include/openssl/conf.h \
 ../deps/openssl/openssl/include/openssl/pkcs12.h ../src/stream_wrap.h \
 ../src/stream_base.h ../src/req-wrap-inl.h ../src/string_bytes.h \
 ../src/node_crypto_bio.h ../src/node_counters.h ../src/stream_base-inl.h
../src/tls_wrap.cc:
../src/tls_wrap.h:
../src/node.h:
../deps/v8/include/v8.h:
../deps/v8/include/v8-version.h:
../deps/v8/include/v8config.h:
../src/node_version.h:
../src/node_crypto.h:
../src/node_crypto_clienthello-inl.h:
../src/node_crypto_clienthello.h:
../src/util-inl.h:
../src/util.h:
../src/node_buffer.h:
../src/env.h:
../src/aliased_buffer.h:
../deps/cares/include/ares.h:
../deps/cares/include/ares_version.h:
../deps/cares/include/ares_build.h:
../deps/cares/include/ares_rules.h:
../src/inspector_agent.h:
../src/node_debug_options.h:
../src/node_platform.h:
../deps/v8/include/libplatform/libplatform.h:
../deps/v8/include/libplatform/libplatform-export.h:
../deps/v8/include/libplatform/v8-tracing.h:
../deps/v8/include/v8-platform.h:
../src/node_mutex.h:
../deps/uv/include/uv.h:
../deps/uv/include/uv-errno.h:
../deps/uv/include/uv-version.h:
../deps/uv/include/uv-unix.h:
../deps/uv/include/uv-threadpool.h:
../deps/uv/include/uv-linux.h:
../src/handle_wrap.h:
../src/async-wrap.h:
../src/base-object.h:
../src/req-wrap.h:
../src/node_http2_state.h:
../src/async-wrap-inl.h:
../src/base-object-inl.h:
../src/env-inl.h:
../src/node_perf_common.h:
../src/node_internals.h:
../src/tracing/trace_event.h:
../src/node_platform.h:
../src/tracing/trace_event_common.h:
../deps/openssl/openssl/include/openssl/ssl.h:
../deps/openssl/openssl/include/openssl/e_os2.h:
../deps/openssl/openssl/include/openssl/opensslconf.h:
../deps/openssl/openssl/include/openssl/../../crypto/opensslconf.h:
../deps/openssl/openssl/include/openssl/../../crypto/../../config/opensslconf.h:
../deps/openssl/openssl/include/openssl/../../crypto/../../config/./archs/linux-x86_64/opensslconf.h:
../deps/openssl/openssl/include/openssl/comp.h:
../deps/openssl/openssl/include/openssl/crypto.h:
../deps/openssl/openssl/include/openssl/stack.h:
../deps/openssl/openssl/include/openssl/safestack.h:
../deps/openssl/openssl/include/openssl/opensslv.h:
../deps/openssl/openssl/include/openssl/ossl_typ.h:
../deps/openssl/openssl/include/openssl/symhacks.h:
../deps/openssl/openssl/include/openssl/bio.h:
../deps/openssl/openssl/include/openssl/x509.h:
../deps/openssl/openssl/include/openssl/buffer.h:
../deps/openssl/openssl/include/openssl/evp.h:
../deps/openssl/openssl/include/openssl/objects.h:
../deps/openssl/openssl/include/openssl/obj_mac.h:
../deps/openssl/openssl/include/openssl/asn1.h:
../deps/openssl/openssl/include/openssl/bn.h:
../deps/openssl/openssl/include/openssl/ec.h:
../deps/openssl/openssl/include/openssl/ecdsa.h:
../deps/openssl/openssl/include/openssl/ecdh.h:
../deps/openssl/openssl/include/openssl/rsa.h:
../deps/openssl/openssl/include/openssl/dsa.h:
../deps/openssl/openssl/include/openssl/dh.h:
../deps/openssl/openssl/include/openssl/sha.h:
../deps/openssl/openssl/include/openssl/x509_vfy.h:
../deps/openssl/openssl/include/openssl/lhash.h:
../deps/openssl/openssl/include/openssl/pkcs7.h:
../deps/openssl/openssl/include/openssl/pem.h:
../deps/openssl/openssl/include/openssl/pem2.h:
../deps/openssl/openssl/include/openssl/hmac.h:
../deps/openssl/openssl/include/openssl/kssl.h:
../deps/openssl/openssl/include/openssl/ssl2.h:
../deps/openssl/openssl/include/openssl/ssl3.h:
../deps/openssl/openssl/include/openssl/tls1.h:
../deps/openssl/openssl/include/openssl/dtls1.h:
../deps/openssl/openssl/include/openssl/pqueue.h:
../deps/openssl/openssl/include/openssl/ssl23.h:
../deps/openssl/openssl/include/openssl/srtp.h:
../deps/openssl/openssl/include/openssl/engine.h:
../deps/openssl/openssl/include/openssl/rand.h:
../deps/openssl/openssl/include/openssl/ui.h:
../deps/openssl/openssl/include/openssl/err.h:
../deps/openssl/openssl/include/openssl/x509v3.h:
../deps/openssl/openssl/include/openssl/conf.h:
../deps/openssl/openssl/include/openssl/pkcs12.h:
../src/stream_wrap.h:
../src/stream_base.h:
../src/req-wrap-inl.h:
../src/string_bytes.h:
../src/node_crypto_bio.h:
../src/node_counters.h:
../src/stream_base-inl.h:
