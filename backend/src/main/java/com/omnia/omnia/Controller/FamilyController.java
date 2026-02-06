package com.omnia.omnia.Controller;


import com.omnia.omnia.Entities.Family;
import com.omnia.omnia.Service.FamilyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/families")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:4300"})
public class FamilyController {

    private final FamilyService familyService;

    @GetMapping
    public ResponseEntity<List<Family>> getAllFamilies() {
        return ResponseEntity.ok(familyService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Family> getFamilyById(@PathVariable UUID id) {
        return ResponseEntity.ok(familyService.findById(id));
    }

    @PostMapping
    public ResponseEntity<Family> createFamily(@RequestBody Family family) {
        return new ResponseEntity<>(familyService.create(family), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Family> updateFamily(
            @PathVariable UUID id,
            @RequestBody Family family) {
        return ResponseEntity.ok(familyService.update(id, family));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFamily(@PathVariable UUID id) {
        familyService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<Family>> searchFamilies(@RequestParam String query) {
        return ResponseEntity.ok(familyService.search(query));
    }

    @GetMapping("/priority/{priority}")
    public ResponseEntity<List<Family>> getFamiliesByPriority(
            @PathVariable String priority) {
        return ResponseEntity.ok(familyService.findByPriority(priority));
    }

    @GetMapping("/count")
    public ResponseEntity<Long> countFamilies() {
        return ResponseEntity.ok(familyService.count());
    }
}