/*-----------------------------------------------------------------------------+
 |  Extended Memory Semantics (EMS)                            Version 1.4.0   |
 |  Synthetic Semantics       http://www.synsem.com/       mogill@synsem.com   |
 +-----------------------------------------------------------------------------+
 |  Copyright (c) 2011-2014, Synthetic Semantics LLC.  All rights reserved.    |
 |  Copyright (c) 2015-2016, Jace A Mogill.  All rights reserved.              |
 |                                                                             |
 | Redistribution and use in source and binary forms, with or without          |
 | modification, are permitted provided that the following conditions are met: |
 |    * Redistributions of source code must retain the above copyright         |
 |      notice, this list of conditions and the following disclaimer.          |
 |    * Redistributions in binary form must reproduce the above copyright      |
 |      notice, this list of conditions and the following disclaimer in the    |
 |      documentation and/or other materials provided with the distribution.   |
 |    * Neither the name of the Synthetic Semantics nor the names of its       |
 |      contributors may be used to endorse or promote products derived        |
 |      from this software without specific prior written permission.          |
 |                                                                             |
 |    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS      |
 |    "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT        |
 |    LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR    |
 |    A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL SYNTHETIC         |
 |    SEMANTICS LLC BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,   |
 |    EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,      |
 |    PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR       |
 |    PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF   |
 |    LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING     |
 |    NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS       |
 |    SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.             |
 |                                                                             |
 +-----------------------------------------------------------------------------*/
#ifndef EMSPROJ_EMS_H
#define EMSPROJ_EMS_H
#define __STDC_FORMAT_MACROS 1
#include <stdio.h>
#include <time.h>
#include <string.h>
#include <inttypes.h>
#include <sys/mman.h>
#include <math.h>
#include <stdlib.h>
#include <unistd.h>
#include <errno.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>

#if !defined _GNU_SOURCE
#  define _GNU_SOURCE
#endif
#include <sched.h>

#include "ems_alloc.h"

//==================================================================
// EMS Full/Empty Tag States
//
#define EMS_TAG_ANY       ((unsigned char)4)  // Never stored, used for matching
#define EMS_TAG_RW_LOCK   ((unsigned char)3)
#define EMS_TAG_BUSY      ((unsigned char)2)
#define EMS_TAG_EMPTY     ((unsigned char)1)
#define EMS_TAG_FULL      ((unsigned char)0)


//==================================================================
// EMS Data types
//
#define EMS_TYPE_INVALID      ((unsigned char)0)
#define EMS_TYPE_BOOLEAN      ((unsigned char)1)
#define EMS_TYPE_STRING       ((unsigned char)2)
#define EMS_TYPE_FLOAT        ((unsigned char)3)
#define EMS_TYPE_INTEGER      ((unsigned char)4)
#define EMS_TYPE_UNDEFINED    ((unsigned char)5)
#define EMS_TYPE_JSON         ((unsigned char)6)  // Catch-all for JSON arrays and Objects



//==================================================================
// Control Block layout stored at the head of each EMS array
//
//        Name          Offset      Description of contents
//---------------------------------------------------------------------------------------
#define NWORDS_PER_CACHELINE 16
#define EMS_ARR_NELEM      (0 * NWORDS_PER_CACHELINE)   // Maximum number of elements in the EMS array
#define EMS_ARR_HEAPSZ     (1 * NWORDS_PER_CACHELINE)   // # bytes of storage for array data: strings, JSON, maps, etc.
#define EMS_ARR_Q_BOTTOM   (2 * NWORDS_PER_CACHELINE)   // Current index of the queue bottom
#define EMS_ARR_STACKTOP   (3 * NWORDS_PER_CACHELINE)   // Current index of the top of the stack/queue
#define EMS_ARR_MAPBOT     (4 * NWORDS_PER_CACHELINE)   // Index of the base of the index map
#define EMS_ARR_MALLOCBOT  (5 * NWORDS_PER_CACHELINE)   // Index of the base of the heap -- malloc structs start here
#define EMS_ARR_HEAPBOT    (6 * NWORDS_PER_CACHELINE)   // Index of the base of data on the heap -- strings start here
#define EMS_ARR_MEM_MUTEX  (7 * NWORDS_PER_CACHELINE)   // Mutex lock for thememory allocator of this EMS region's
#define EMS_ARR_FILESZ     (8 * NWORDS_PER_CACHELINE)   // Total size in bytes of the EMS region
// Tag data may follow data by as much as 8 words, so
// A gap of at least 8 words is required to leave space for
// the tags associated with header data
#define EMS_ARR_CB_SIZE   (16 * NWORDS_PER_CACHELINE)   // Index of the first EMS array element



//==================================================================
// EMS Control Block -- Global State for EMS
#define EMS_CB_NTHREADS     0     // Number of threads
#define EMS_CB_NBAR0        1     // Number of threads at Barrier 0
#define EMS_CB_NBAR1        2     // Number of threads at Barrier 1
#define EMS_CB_BARPHASE     3     // Current Barrier Phase (0 or 1)
#define EMS_CB_CRITICAL     4     // Mutex for critical regions
#define EMS_CB_SINGLE       5     // Number of threads passed through an execute-once region
#define EMS_LOOP_IDX        6     // Index of next iteration in a Parallel loop to schedule
#define EMS_LOOP_START      7     // Index of first iteration in a parallel loop
#define EMS_LOOP_END        8     // Index of last iteration in a parallel loop
#define EMS_LOOP_CHUNKSZ    9     // Current Number of iterations per thread
#define EMS_LOOP_MINCHUNK  10     // Smallest number of iterations per thread
#define EMS_LOOP_SCHED     11     // Parallel loop scheduling method:
#define    EMS_SCHED_GUIDED  1200
#define    EMS_SCHED_DYNAMIC 1201
#define    EMS_SCHED_STATIC  1202
#define EMS_CB_LOCKS       12     // First index of an array of locks, one lock per thread



//==================================================================
//  Pointers to mmapped EMS buffers
#define EMS_MAX_N_BUFS 4096
#define MAX_NUMBER2STR_LEN 40   // Maximum number of characters in a %d or %f format
#define MAX_FNAME_LEN 256
extern char   *emsBufs[EMS_MAX_N_BUFS];
extern size_t  emsBufLengths[EMS_MAX_N_BUFS];
extern char    emsBufFilenames[EMS_MAX_N_BUFS][MAX_FNAME_LEN];

//  Maximum number of slots to check due to conflicts
#define  MAX_OPEN_HASH_STEPS 200


//==================================================================
//  Macros to translate from EMS Data Indexes and EMS Control Block
//  indexes to offsets in the EMS shared memory
#define EMSwordSize          (sizeof(size_t))
#define EMSnWordsPerTagWord  (EMSwordSize-1)
#define EMSnWordsPerLine     EMSwordSize


//==================================================================
//  Layout of EMS memory
//     Tagged Memory
//         CB:     Control Block of array state
//         Data:   Scalar user data
//         Map:    Scalar index map data
//     Untagged Memory
//         Malloc: Storage for the free/used structures
//         Heap:   Open Heap storage
#define EMSappIdx2emsIdx(idx)         ((((idx) / EMSnWordsPerTagWord) * EMSnWordsPerLine) + ((idx) % EMSnWordsPerTagWord) )
#define EMSappIdx2LineIdx(idx)        ( ((idx) / EMSnWordsPerTagWord) * EMSnWordsPerLine)
#define EMSappIdx2TagWordIdx(idx)     ( EMSappIdx2LineIdx(idx) + EMSnWordsPerTagWord )
#define EMSappIdx2TagWordOffset(idx)  ( EMSappIdx2TagWordIdx(idx) * EMSwordSize )
#define EMSappTag2emsTag(idx)         ( EMSappIdx2TagWordOffset(idx) + ((idx) % EMSnWordsPerTagWord) )
#define EMScbData(idx)        EMSappIdx2emsIdx(idx)
#define EMScbTag(idx)         EMSappTag2emsTag(idx)
#define EMSdataData(idx)    ( EMSappIdx2emsIdx((idx) + EMS_ARR_CB_SIZE) )
#define EMSdataTag(idx)     ( EMSappTag2emsTag((idx) + EMS_ARR_CB_SIZE) )
#define EMSdataTagWord(idx) ( EMSappIdx2TagWordOffset((idx) + EMS_ARR_CB_SIZE) )
#define EMSmapData(idx)     ( EMSappIdx2emsIdx((idx) + EMS_ARR_CB_SIZE + bufInt64[EMScbData(EMS_ARR_NELEM)]) )
#define EMSmapTag(idx)      ( EMSappTag2emsTag((idx) + EMS_ARR_CB_SIZE + bufInt64[EMScbData(EMS_ARR_NELEM)]) )
#define EMSheapPtr(idx)     ( &bufChar[ bufInt64[EMScbData(EMS_ARR_HEAPBOT)] + (idx) ] )

#define EMS_MEM_MALLOCBOT(bufChar) ((struct emsMem *) &bufChar[ bufInt64[EMScbData(EMS_ARR_MALLOCBOT)] ])


//==================================================================
//  Yield the processor and sleep (using exponential decay) without
//  using resources/
//  Used within spin-loops to reduce hot-spotting
#define RESET_NAP_TIME  int EMScurrentNapTime = 1
#define MAX_NAP_TIME  1000000
#define NANOSLEEP    {                         \
    struct timespec     sleep_time;            \
    sleep_time.tv_sec  = 0;                    \
    sleep_time.tv_nsec = EMScurrentNapTime;    \
    nanosleep(&sleep_time, NULL);              \
    EMScurrentNapTime *= 2;                    \
    if(EMScurrentNapTime > MAX_NAP_TIME) {     \
        EMScurrentNapTime = MAX_NAP_TIME;      \
    }                                          \
 }


#define EMS_ALLOC(addr, len, bufChar, errmsg, retval)                    \
  addr = emsMutexMem_alloc( EMS_MEM_MALLOCBOT(bufChar), \
                (size_t) len, (char*) &bufInt64[EMScbData(EMS_ARR_MEM_MUTEX)] ); \
  if(addr < 0)  { \
      fprintf(stderr, "%s:%d (%s)  ERROR: EMS memory allocation of len(%zx) failed: %s\n", \
              __FILE__, __LINE__, __FUNCTION__, len, errmsg); \
      return retval; \
  }

#define EMS_FREE(addr) \
  emsMutexMem_free( EMS_MEM_MALLOCBOT(bufChar), \
            (size_t) addr, (char*) &bufInt64[EMScbData(EMS_ARR_MEM_MUTEX)] )

size_t emsMutexMem_alloc(struct emsMem *heap,   // Base of EMS malloc structs
                         size_t len,    // Number of bytes to allocate
                         volatile char *mutex);  // Pointer to the mem allocator's mutex
void emsMutexMem_free(struct emsMem *heap,  // Base of EMS malloc structs
                      size_t addr,  // Offset of alloc'd block in EMS memory
                      volatile char *mutex); // Pointer to the mem allocator's mutex

extern int EMSmyID;   // EMS Thread ID

#define EMSisMapped (bufInt64[EMScbData(EMS_ARR_MAPBOT)]*(int64_t)EMSwordSize != bufInt64[EMScbData(EMS_ARR_MALLOCBOT)])

#include "ems_proto.h"

#endif //EMSPROJ_EMS_H
