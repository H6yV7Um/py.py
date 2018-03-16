#COMAKE2 edit-mode: -*- Makefile -*-
####################64Bit Mode####################
ifeq ($(shell uname -m),x86_64)
CC=gcc
CXX=g++
CXXFLAGS=-g \
  -pipe \
  -O2 \
  -W \
  -Wall \
  -fPIC \
  -Wno-unused-parameter
CFLAGS=-g \
  -pipe \
  -O2 \
  -W \
  -Wall \
  -fPIC
CPPFLAGS=-D_GNU_SOURCE \
  -D__STDC_LIMIT_MACROS \
  -DNDEBUG
INCPATH=-I. \
  -I../../../../../app/ecom/cm/interface
DEP_INCPATH=-I../../../../../app/ecom/cm/interface \
  -I../../../../../app/ecom/cm/interface/include \
  -I../../../../../app/ecom/cm/interface/output \
  -I../../../../../app/ecom/cm/interface/output/include \
  -I../../../../../third-64/protobuf \
  -I../../../../../third-64/protobuf/include \
  -I../../../../../third-64/protobuf/output \
  -I../../../../../third-64/protobuf/output/include \
  -I../../../../../thirdsrc/protobuf \
  -I../../../../../thirdsrc/protobuf/include \
  -I../../../../../thirdsrc/protobuf/output \
  -I../../../../../thirdsrc/protobuf/output/include

#============ CCP vars ============
CCHECK=@ccheck.py
CCHECK_FLAGS=
PCLINT=@pclint
PCLINT_FLAGS=
CCP=@ccp.py
CCP_FLAGS=


#COMAKE UUID
COMAKE_MD5=6598bd25989961c7aab97fcd4d608428  COMAKE


.PHONY:all
all:comake2_makefile_check librs_if.a 
	@echo "[[1;32;40mCOMAKE:BUILD[0m][Target:'[1;32;40mall[0m']"
	@echo "make all done"

.PHONY:comake2_makefile_check
comake2_makefile_check:
	@echo "[[1;32;40mCOMAKE:BUILD[0m][Target:'[1;32;40mcomake2_makefile_check[0m']"
	#in case of error, update 'Makefile' by 'comake2'
	@echo "$(COMAKE_MD5)">comake2.md5
	@md5sum -c --status comake2.md5
	@rm -f comake2.md5

.PHONY:ccpclean
ccpclean:
	@echo "[[1;32;40mCOMAKE:BUILD[0m][Target:'[1;32;40mccpclean[0m']"
	@echo "make ccpclean done"

.PHONY:clean
clean:ccpclean
	@echo "[[1;32;40mCOMAKE:BUILD[0m][Target:'[1;32;40mclean[0m']"
	rm -rf librs_if.a
	rm -rf ./output/lib/librs_if.a
	rm -rf output/include/rs_if/rs.pb.h
	rm -rf ./rs.pb.cc
	rm -rf ./rs.pb.h
	rm -rf ./rs_if_rs.pb.o

.PHONY:dist
dist:
	@echo "[[1;32;40mCOMAKE:BUILD[0m][Target:'[1;32;40mdist[0m']"
	tar czvf output.tar.gz output
	@echo "make dist done"

.PHONY:distclean
distclean:clean
	@echo "[[1;32;40mCOMAKE:BUILD[0m][Target:'[1;32;40mdistclean[0m']"
	rm -f output.tar.gz
	@echo "make distclean done"

.PHONY:love
love:
	@echo "[[1;32;40mCOMAKE:BUILD[0m][Target:'[1;32;40mlove[0m']"
	@echo "make love done"

librs_if.a:rs_if_rs.pb.o \
  ./rs.pb.h
	@echo "[[1;32;40mCOMAKE:BUILD[0m][Target:'[1;32;40mlibrs_if.a[0m']"
	ar crs librs_if.a rs_if_rs.pb.o
	mkdir -p ./output/lib
	cp -f librs_if.a ./output/lib
	mkdir -p output/include/rs_if/
	cp -f ./rs.pb.h output/include/rs_if/

./rs.pb.cc \
  ./rs.pb.h:rs.proto
	@echo "[[1;32;40mCOMAKE:BUILD[0m][Target:'[1;32;40m./rs.pb.cc \
  ./rs.pb.h[0m']"
	../../../../..//thirdsrc/protobuf/install/bin/protoc --cpp_out=./ --proto_path=./ --proto_path=../../../cm/interface rs.proto

rs.proto:
	@echo "[[1;32;40mCOMAKE:BUILD[0m][Target:'[1;32;40mrs.proto[0m']"
	@echo "ALREADY BUILT"

./rs_if_rs.pb.o:./rs.pb.cc \
  rs.pb.cc \
  rs.pb.h
	@echo "[[1;32;40mCOMAKE:BUILD[0m][Target:'[1;32;40m./rs_if_rs.pb.o[0m']"
	$(CXX) -c $(INCPATH) $(DEP_INCPATH) $(CPPFLAGS) $(CXXFLAGS)  -o ./rs_if_rs.pb.o ./rs.pb.cc

endif #ifeq ($(shell uname -m),x86_64)


